// HomeScreen.js
// Main dashboard: shows daily goals, intake, rings, and recipe suggestions

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScrollView, Pressable, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import NutritionCard from '../components/NutritionCard';
import WeekSelector from '../components/WeekSelector';
import NutritionRings from '../components/NutritionRings';
import RecipeCard from '../components/RecipeCard';

import { getProfile } from '../storage/profileStorage';
import { addDays, startOfWeek, toDateStr } from '../utils/date';
import { getIntakeByDate } from '../storage/nutritionStorage';
import { defaultGoals, nutrients } from '../utils/nutrition';
import { getUserGoals } from '../storage/goalsStorage';
import { getRecipes } from '../storage/recipesStorage';
import { seedDemoData } from './demoData';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  // User and state variables
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [totals, setTotals] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userGoals, setUserGoals] = useState(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);

  // Derived values for display and logic
  const effectiveGoals = userGoals || defaultGoals;
  const today = new Date();
  const friendlyDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const selectedDateStr = useMemo(() => toDateStr(selectedDate), [selectedDate]);
  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  // Prepare values for NutritionRings
  const values = useMemo(() => {
    const pct = (k) => Math.min(((totals[k] || 0) / effectiveGoals[k]) * 100, 100);
    const cur = (k) =>
      k === 'energy-kcal' ? Math.round(totals[k] || 0) : (totals[k] || 0).toFixed(1);
    return nutrients.map(({ key, name, unit, color }) => ({
      name,
      unit,
      color,
      goal: effectiveGoals[key],
      current: cur(key),
      percentage: pct(key),
    }));
  }, [totals, effectiveGoals]);

  // Update info and totals when selected date changes or screen is focused
  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        const profile = await getProfile();
        const [entries, goalsFromStore] = await Promise.all([
          getIntakeByDate(selectedDateStr),
          getUserGoals(),
        ]);
        let intakeTotals = {};
        if (Array.isArray(entries)) {
          for (const item of entries) {
            for (const [k, v] of Object.entries(item.nutrients || {})) {
              intakeTotals[k] = (intakeTotals[k] || 0) + v;
            }
          }
        }
        setTotals(intakeTotals);
        setUserGoals(goalsFromStore || null);
        setAvatar(profile.avatar || null);
        setName(profile.name || 'User');
      };
      run();
    }, [selectedDateStr])
  );

  // Load random recipe suggestions on mount
  useEffect(() => {
    seedDemoData(); // Demo Data
    (async () => {
      let recipes = await getRecipes();
      recipes = recipes.sort(() => Math.random() - 0.5);
      setSuggestedRecipes(recipes.slice(0, 8));
    })();
  }, []);

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#fff' }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header with welcome, date, and profile icon */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Welcome, {name}!</Text>
              <Text style={styles.dateText}>{friendlyDate}</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Profile')} accessibilityLabel="Profile">
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.profilePic} />
              ) : (
                <Ionicons name="person-circle" size={width * 0.19} color="#ccc" />
              )}
            </Pressable>
          </View>   
        </View>

        {/* Daily goals card */}
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        <View style={styles.goalsCardWrapper}>
          <Pressable onPress={() => navigation.navigate('EditGoals')}>
            <NutritionCard values={effectiveGoals} nutrients={nutrients} />
          </Pressable>
        </View>

        {/* Daily intake & week selector */}
        <Text style={styles.sectionTitle}>Daily Intake</Text>
        <View style={styles.weekDivider} />

        <WeekSelector
          weekStart={weekStart}
          weekDays={weekDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevWeek={() => setSelectedDate(addDays(selectedDate, -7))}
          onNextWeek={() => setSelectedDate(addDays(selectedDate, 7))}
        />

        <View style={styles.weekDivider} />
        {/* Nutrition rings */}
        <View style={{ marginTop: height * 0.0025 }}>
          <NutritionRings size={width} values={values.slice(0, 4)} />
          <NutritionRings size={width} values={values.slice(4, 8)} />
        </View>

        {/* Suggested recipes */}
        <Text style={[styles.sectionTitle, { marginTop: height * 0.018 }]}>Suggested Recipes</Text>
        {suggestedRecipes.length === 0 ? (
          <Text style={{ paddingLeft: width * 0.042, color: '#6b7280' }}>
            No matching recipes found today. Try adjusting your intake or come back later.
          </Text>
        ) : (
          <View style={{ width: width, paddingHorizontal: width * 0.042 }}>
            {suggestedRecipes.map(item => (
              <RecipeCard recipe={item} key={item.id.toString()} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for HomeScreen layout and components
const styles = StyleSheet.create({
  headerContainer: {
    width: width, 
    position: 'relative',
    marginBottom: height * 0.01,
  },
  headerRow: {
    width: width,
    paddingHorizontal: width * 0.055,        
    paddingVertical: height * 0.012,         
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: width * 0.065,                 
    fontWeight: '700',
    color: '#111827',
    letterSpacing: width * 0.0005,            
  },
  dateText: {
    fontSize: width * 0.043,
    color: '#78C841',
    fontWeight: '500',
    marginTop: height * 0.007,
  },
  profilePic: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,               
    borderWidth: width * 0.008,              
    borderColor: '#78C841',
  },
  sectionTitle: {
    width: width,                             
    paddingHorizontal: width * 0.055,
    marginTop: height * 0.012,
    marginBottom: height * 0.019,
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: width * 0.0007,            
  },
  goalsCardWrapper: {
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingBottom: height * 0.062,
    backgroundColor: '#FFFFFF',
  },
  weekDivider: {
    width: width * 0.92,                      
    height: 1,
    backgroundColor: '#EEF0F2',
    alignSelf: 'center',
    marginBottom: height * 0.013,
  },
});