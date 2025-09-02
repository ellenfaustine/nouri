// NutritionCard.js
// Displays a card showing nutrition values in a grid

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Shows a single nutrient value and label
export function Nutrient({ label, value, unit }) {
  return (
    <View style={styles.nutrientBox}>
      <Text style={styles.nutrientName}>{label}</Text>
      <Text style={styles.nutrientValue}>
        {value == null
          ? '—'
          : Number(value) % 1 === 0
            ? Number(value).toString()
            : Number(value).toFixed(1)
        } {unit}
      </Text>
    </View>
  );
}

// Shows multiple nutrient values in a card
export default function NutritionCard({ values, nutrients }) {
  return (
    <View style={styles.nutritionCard}>
      <View style={styles.grid}>
        {nutrients.map(({ key, name, unit }) => (
          <Nutrient
            key={key}
            label={name}
            unit={unit}
            value={values[key]}
          />
        ))}
      </View>
    </View>
  );
}

// Styles for nutrition card and nutrients grid
const styles = StyleSheet.create({
  nutritionCard: {
    width: width * 0.92,
    backgroundColor: '#E5E7EB',
    borderRadius: width * 0.035,             
    paddingVertical: height * 0.015,         
    paddingHorizontal: width * 0.03,          
    marginBottom: height * 0.031,            
    borderWidth: 1,
    borderColor: '#eef0f2',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: width * 0.02,              
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width * 0.025,                     
    justifyContent: 'space-between',
  },
  nutrientBox: {
    width: width * 0.41,
    borderWidth: 1,
    borderColor: '#eef0f2',
    borderRadius: width * 0.03,               
    paddingVertical: height * 0.0125,         
    paddingHorizontal: width * 0.03,          
    backgroundColor: '#fff',
  },
  nutrientName: {
    fontSize: width * 0.0325,                 
    color: '#6b7280',
  },
  nutrientValue: {
    fontSize: width * 0.04,                  
    fontWeight: '700',
    color: '#111827',
    marginTop: height * 0.0025,               
  },
});