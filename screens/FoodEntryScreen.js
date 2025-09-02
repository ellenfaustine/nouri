// FoodEntryScreen.js
// Screen for manually entering a food, snack, or meal without a barcode

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { normalizeNutrientsFromManual } from '../utils/nutrition'; 
import { logFoodEntry } from '../storage/nutritionStorage'; 

const { width } = Dimensions.get('window');

export default function FoodEntryScreen() {
  const { params = {} } = useRoute(); // Get any pre-filled food info from navigation params
  const navigation = useNavigation();

  // State to track all form inputs
  const [form, setForm] = useState({
    name: params.name || '',
    brand: params.brand || '',
    serving: params.serving || '',
    calories: '', 
    fat: '', 
    sugars: '', 
    sodiumMg: '',
    protein: '', 
    fiber: '', 
    calciumMg: '', 
    ironMg: '',
  });

  // Updates a field in the form state
  const updateField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Convert string input to number
  const num = x => {
    const v = parseFloat(String(x).replace(',', '.'));
    return Number.isFinite(v) ? v : 0;
  };

  // Handle adding the food entry to daily intake
  const addToDailyIntake = async () => {
    // Validate required field
    if (!form.name.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Missing Name', 'Please enter a name for your food entry.');
      return;
    }

    // Normalize nutrients and log the entry
    const nutrients = normalizeNutrientsFromManual(form, num);
    await logFoodEntry({
      name: form.name,
      brand: form.brand,
      serving: form.serving,
      nutrients,
      source: 'manual',
    });

    // Provide success feedback and navigate back
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Success',
      'This food has been added to your daily intake.',
      [{ text: 'OK', style: 'default' }]
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      edges={['top', 'bottom', 'left', 'right']}
    >
      {/* Prevents keyboard from covering input fields on iOS/Android */}
      <KeyboardAvoidingView 
        style={{ flex:1 }} 
        behavior={Platform.OS==='ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

            {/* Food Info section */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="E.g. Banana"
                value={form.name}
                onChangeText={t => updateField('name', t)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="E.g. Dole"
                value={form.brand}
                onChangeText={t => updateField('brand', t)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Serving Size</Text>
              <TextInput
                style={styles.input}
                placeholder="E.g. 1 portion / 25 g"
                value={form.serving}
                onChangeText={t => updateField('serving', t)}
              />
            </View>

            {/* Nutrients section heading */}
            <Text style={[styles.label, { marginBottom: width * 0.035 }]}>Per Serving</Text>

            {/* Nutrient inputs in a row layout */}
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Calories (kcal)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.calories}
                onChangeText={t => updateField('calories', t)}
                placeholder="e.g. 200"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Fat (g)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.fat}
                onChangeText={t => updateField('fat', t)}
                placeholder="e.g. 9"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Sugar (g)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.sugars}
                onChangeText={t => updateField('sugars', t)}
                placeholder="e.g. 12"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Sodium (mg)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.sodiumMg}
                onChangeText={t => updateField('sodiumMg', t)}
                placeholder="e.g. 85"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Protein (g)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.protein}
                onChangeText={t => updateField('protein', t)}
                placeholder="e.g. 2"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Fiber (g)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.fiber}
                onChangeText={t => updateField('fiber', t)}
                placeholder="e.g. 1"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Calcium (mg)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.calciumMg}
                onChangeText={t => updateField('calciumMg', t)}
                placeholder="e.g. 15"
              />
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Iron (mg)</Text>
              <TextInput
                style={styles.inputRight}
                keyboardType="numeric"
                value={form.ironMg}
                onChangeText={t => updateField('ironMg', t)}
                placeholder="e.g. 0.5"
              />
            </View>
          </ScrollView>

          {/* Fixed footer with helper text and Add button */}
          <View style={styles.fixedFooter}>
            <Text style={styles.helperText}>
              <Text style={{ color: 'red' }}>*</Text> is required
            </Text>
            <Pressable style={styles.addButton} onPress={addToDailyIntake}>
              <Text style={styles.addButtonText}>Add to Daily Intake</Text>
            </Pressable>
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
  label: { 
    fontSize: width * 0.04, 
    fontWeight: '600',
    color: '#444', 
    marginBottom: width * 0.015 
  },
  inputGroup: {
    marginBottom: width * 0.045 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.025,
    fontSize: width * 0.036,
    backgroundColor: '#fff',
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.035,
  },
  nutrientLabel: {
    flex: 1.3, 
    fontSize: width * 0.038,
    color: '#222',
    fontWeight: '500',
  },
  inputRight: {
    flex: 1.7, 
    minWidth: width * 0.22,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.02,
    fontSize: width * 0.038,
    backgroundColor: '#fff',
    textAlign: 'right',
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
    fontSize: width * 0.030,
    marginBottom: width * 0.025,
  },
  addButton: {
    backgroundColor: '#00C2FF',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.025,
    flexGrow: 1,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: width * 0.042,
  },
});
