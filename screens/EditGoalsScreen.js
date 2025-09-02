// EditGoalsScreen.js
// Screen for editing the user's daily nutrition goals

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { getUserGoals, setUserGoals, resetUserGoals } from '../storage/goalsStorage';
import { defaultGoals, nutrients } from '../utils/nutrition';

const { width } = Dimensions.get('window');

export default function EditGoalsScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({});   // track form inputs for all nutrients

  // Load saved goals on first render
  useEffect(() => {
    (async () => {
      try {
        const loaded = await getUserGoals();
        const goalsToUse = loaded || defaultGoals;  // fallback to default goals
        setForm(Object.fromEntries(Object.entries(goalsToUse).map(([k, v]) => [k, String(v)])));
      } catch {
        setForm(Object.fromEntries(Object.entries(defaultGoals).map(([k, v]) => [k, String(v)])));
      }
    })();
  }, []);

  // Update a specific nutrient field in the form
  const updateField = (key, text) => {
    setForm((f) => ({ ...f, [key]: text }));
  };

  // Validate and save user goals
  const saveGoals = async () => {
    const parsed = {};
    for (const k of Object.keys(defaultGoals)) {
      const val = (form[k] ?? '').trim();
      const num = parseFloat(val);

      // Ensure valid numeric input
      if (!isFinite(num) || num <= 0) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Invalid value', `Please enter a valid amount for your daily nutrition goal`);
        return;
      }
      parsed[k] = num;
    }
    await setUserGoals(parsed);

    // Provide success feedback and navigate back
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved', 'Nutrition goals updated successfully.');
    navigation.goBack();
  };

  // Reset all fields to default nutrition goals
  const resetDefaults = async () => {
    await resetUserGoals();
    setForm(Object.fromEntries(Object.entries(defaultGoals).map(([k, v]) => [k, String(v)])));

    // Provide haptic feedback and alert
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Reset', 'Your nutrition goals were restored to default.');
    navigation.goBack();
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      edges={['top', 'bottom', 'left', 'right']}
    >
      {/* Prevents keyboard from covering input fields on iOS/Android */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>

            {/* Render input rows for each nutrient */}
            {nutrients.map(({ key, name, unit }) => (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>
                  {name} ({unit})
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                  value={form[key] ?? ''}             
                  onChangeText={(t) => updateField(key, t)}
                  placeholder="0"
                  selectTextOnFocus
                />
              </View>
            ))}
          </ScrollView>

          {/* Fixed footer with helper text and buttons */}
          <View style={styles.fixedFooter}>
            <Text style={styles.helperText}>
              Default values are based on FDA guidelines for a 2,000 calorie diet.
            </Text>
            <View style={styles.buttonRow}>
              <Pressable onPress={saveGoals} style={[styles.button, styles.saveButton]}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
              <Pressable onPress={resetDefaults} style={[styles.button, styles.resetButton]}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles for layout, input fields, and footer buttons
const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
  },
  row: { 
    marginBottom: width * 0.045 
  },
  label: { 
    fontSize: width * 0.04, 
    fontWeight: '600',
    color: '#444', 
    marginBottom: width * 0.015 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.025,
    fontSize: width * 0.038,
    backgroundColor: '#fff',
  },
  fixedFooter: {
    flexDirection: 'column',
    padding: width * 0.03,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? width * 0.02 : width * 0.03,
    alignItems: 'stretch',
  },
  helperText: {
    color: '#666',
    fontSize: width * 0.029,
    textAlign: 'center',
    marginBottom: width * 0.025,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: width * 0.03,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.025,
    flexGrow: 1,
    alignItems: 'center',
  },
  saveButton: { 
    backgroundColor: '#00C2FF' 
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: width * 0.042,
  },
  resetButton: { 
    borderWidth: 1, 
    borderColor: '#00C2FF' 
  },
  resetButtonText: { 
    color: '#00C2FF', 
    fontWeight: '700',
    fontSize: width * 0.042,
  },
});
