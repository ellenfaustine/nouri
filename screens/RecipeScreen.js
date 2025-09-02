// RecipeScreen.js
// Screen for displaying recipe details, nutrition, ingredients, and instructions

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { getRecipeDetails } from '../storage/recipesStorage';
import { nutrients } from '../utils/nutrition';
import { normalizeNutrientsFromSpoonacular } from '../utils/nutrition'; 
import { getBookmarks, addBookmark, removeBookmark } from '../storage/bookmarksStorage';
import NutritionCard from '../components/NutritionCard';
import { logFoodEntry } from '../storage/nutritionStorage';

import { Ionicons } from '@expo/vector-icons';
import LoadingOverlay from '../components/LoadingOverlay';

import timeIcon from '../assets/icons/time.png';
import caloriesIcon from '../assets/icons/calories.png';
import veganIcon from '../assets/icons/vegan.png';
import glutenIcon from '../assets/icons/gluten.png';
import dairyIcon from '../assets/icons/dairy.png';

const { width, height } = Dimensions.get('window');

export default function RecipeScreen({ route }) {
  const { id } = route.params;  // Recipe ID from navigation
  const navigation = useNavigation();
  
  const [recipe, setRecipe] = useState(null);                         // Recipe details
  const [loading, setLoading] = useState(true);                       // Loading overlay
  const [bookmarked, setBookmarked] = useState(false);                // Bookmark status
  const [showHeaderShadow, setShowHeaderShadow] = useState(false);    // Header shadow effect

  // Normalized nutrients for display
  const normalizedNutrients = recipe ? normalizeNutrientsFromSpoonacular(recipe) : {};

  // Fetch recipe details and bookmark status
  useEffect(() => {
    const getDetail = async () => {
      setLoading(true);

      const data = await getRecipeDetails(id);          // Load recipe
      setRecipe(data);

      const bookmarks = await getBookmarks();           // Load bookmarks
      setBookmarked(bookmarks.some(r => r.id === id));

      setLoading(false);
    };
    getDetail();
  }, [id]);

  // Add recipe to daily intake
  async function addToDailyIntake() {
    if (!recipe?.nutrition?.nutrients) return;

    const nutrients = normalizeNutrientsFromSpoonacular(recipe);

    await logFoodEntry({
      name: recipe.title,
      brand: recipe.sourceName || '',
      serving: recipe.servingSize || '',
      nutrients,
      source: 'recipe',
    });

    // Provide success feedback and navigate back
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Success',
      'This recipe has been added to your daily intake.',
      [{ text: 'OK', style: 'default' }]
    );
  }

  // Toggle bookmark status
  const toggleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(id);
    } else {
      await addBookmark(recipe);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      edges={['top', 'left', 'right']}
    >
      {/* Show loading overlay */}
      <LoadingOverlay visible={loading} message="Loading recipe..." />
      
      {/* Handle recipe not found */}
      {(!loading && !recipe) ? (
        <Text style={{ margin: width * 0.054 }}>Recipe not found.</Text>
      ) : !loading ? (
        <>
          <ScrollView
            style={styles.container}
            stickyHeaderIndices={[1]}
            onScroll={e => {
              setShowHeaderShadow(e.nativeEvent.contentOffset.y >= 320);
            }}
            scrollEventThrottle={16}
          >
            {/* Recipe image with close button */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipe.image }} style={styles.image} />
              <Pressable
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
                hitSlop={10}
              >
                <Ionicons name="close" size={width * 0.07} color="#111" />
              </Pressable>
            </View>

            {/* Sticky header with shadow */}
            <View style={styles.stickyHeader}>
              <Text style={styles.title}>{recipe.title}</Text>
              {showHeaderShadow && (
                <LinearGradient
                  colors={['rgba(0,0,0,0.11)', 'rgba(0,0,0,0.05)', 'transparent']}
                  style={styles.headerShadow}
                  pointerEvents="none"
                />
              )}
            </View>

            <View style={styles.body}>
              {/* Stats and bookmark */}
              <View style={styles.infoRow}>
                <View style={styles.statsRow}>
                  <View style={styles.iconTextRow}>
                    <Image source={timeIcon} style={styles.iconSmall} />
                    <Text style={styles.infoText}>{recipe.readyInMinutes} min</Text>
                  </View>
                   <View style={styles.iconTextRow}>
                    <Image source={caloriesIcon} style={styles.iconSmall} />
                    <Text style={styles.infoText}>
                      {normalizedNutrients['energy-kcal'] == null
                        ? '—'
                        : Number(normalizedNutrients['energy-kcal']) % 1 === 0
                          ? Number(normalizedNutrients['energy-kcal']).toString()
                          : Number(normalizedNutrients['energy-kcal']).toFixed(1)
                      } kcal
                    </Text>
                  </View>
                </View>
                <Pressable onPress={toggleBookmark} hitSlop={10}>
                  <Ionicons
                    name={bookmarked ? "bookmark" : "bookmark-outline"}
                    size={width * 0.06}
                    color={bookmarked ? "#6C63FF" : "#888"}
                  />
                </Pressable>
              </View>

              {/* Dietary tags */}
              <View style={styles.tagRow}>
                {recipe.vegan && (
                  <View style={styles.tag}>
                    <Image source={veganIcon} style={styles.icon} />
                    <Text style={styles.tagText}>Vegan</Text>
                  </View>
                )}
                {recipe.glutenFree && (
                  <View style={styles.tag}>
                    <Image source={glutenIcon} style={styles.icon} />
                    <Text style={styles.tagText}>Gluten-Free</Text>
                  </View>
                )}
                {recipe.dairyFree && (
                  <View style={styles.tag}>
                    <Image source={dairyIcon} style={styles.icon} />
                    <Text style={styles.tagText}>Dairy-Free</Text>
                  </View>
                )}
              </View>

              {/* Nutrition Facts*/}
              <Text style={styles.sectionTitle}>Nutrition Facts</Text>
              <NutritionCard values={normalizedNutrients} nutrients={nutrients} />
              <View style={styles.divider} />


              {/* Ingredients */}
              {recipe.extendedIngredients && (
                <>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {recipe.extendedIngredients.map((ing, i) => (
                    <Text key={i} style={styles.ingredient}>
                      • {ing.original}
                    </Text>
                  ))}
                </>
              )}
              <View style={styles.divider} />

              {/* Instructions */}
              {recipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  {recipe.analyzedInstructions[0].steps.map((step, idx) => (
                    <Text key={step.number ?? idx} style={styles.instructions}>
                      {step.number}. {step.step}
                    </Text>
                  ))}
                </>
              ) : recipe.instructions ? (
                <>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  <Text style={styles.instructions}>{recipe.instructions.replace(/<[^>]+>/g, '')}</Text>
                </>
              ) : (
                <Text>No instructions available.</Text>
              )}

            </View>
          </ScrollView>

          {/* Add to daily intake button */}
          <View style={styles.fixedFooter}>
            <Pressable style={styles.button} onPress={addToDailyIntake}>
              <Text style={styles.buttonText}>Add to Daily Intake</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
}

// Styles for layout, image, nutrition, tags, and buttons
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: width * 0.68,
    marginBottom: width * 0.017,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: width * 0.035,
    right: width * 0.04,
    padding: width * 0.012,
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeader: {
    backgroundColor: '#fff',
    paddingTop: width * 0.026,
    zIndex: 100,
  },
  title: { 
    fontSize: width * 0.053, 
    fontWeight: '700', 
    paddingHorizontal: width * 0.043,
    paddingBottom: width * 0.027,
  },
  headerShadow: {
    position: 'absolute',
    left: 0,           
    right: 0,
    bottom: -width * 0.048,        
    height: width * 0.048,
    zIndex: 101,
  },
  body: { 
    paddingTop: width * 0.043,
    paddingHorizontal: width * 0.043,
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: -width * 0.037, 
    marginBottom: width * 0.022, 
  },
  statsRow: {
    flexDirection: 'row',
    gap: width * 0.022,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmall: {
    width: width * 0.054,
    height: width * 0.054,
    marginRight: width * 0.008,
  },
  infoText: { 
    fontSize: width * 0.037, 
    color: '#888' 
  },
  tagRow: { 
    flexDirection: 'row', 
    gap: width * 0.005, 
    marginBottom: width * 0.01, 
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1EDBE',
    borderRadius: width * 0.032,
    paddingHorizontal: width * 0.021,
    paddingVertical: width * 0.005,
    marginRight: width * 0.013,
    marginBottom: width * 0.011,
  },
  icon: {
    width: width * 0.043,
    height: width * 0.043,
    marginRight: width * 0.011,
  },
  tagText: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#25561C',
  },
  sectionTitle: {
    fontSize: width * 0.048,
    fontWeight: '700',
    marginTop: width * 0.04,
    marginBottom: width * 0.03,
    color: '#000',
  },
  ingredient: { 
    fontSize: width * 0.037, 
    marginBottom: width * 0.005, 
  },
  instructions: { 
    fontSize: width * 0.037, 
    lineHeight: width * 0.053, 
    marginBottom: width * 0.027, 
  },
  fixedFooter: {
    flexDirection: 'column',
    padding: width * 0.03,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? width * 0.08 : width * 0.03,
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#00C2FF',
    paddingVertical: width * 0.038,
    borderRadius: width * 0.021,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.043,
  },
  divider: {
    width: width * 0.89,                      
    height: 2,
    backgroundColor: '#EEF0F2',
    alignSelf: 'center',
    marginVertical: height * 0.005,
  },
});
