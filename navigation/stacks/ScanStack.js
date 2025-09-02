// ScanStack.js
// Stack navigator for the Scan section of the app

import React from 'react';
import { Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScanScreen from '../../screens/ScanScreen';
import FoodEntryScreen from '../../screens/FoodEntryScreen';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

export default function ScanStack() {
  return (
    <Stack.Navigator>

      {/* Main Scan screen (barcode scanning) */}
      <Stack.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{ headerShown: false }} 
      />

      {/* Manual Food Entry screen presented as a modal with a close button */}
      <Stack.Screen
        name="FoodEntry"
        component={FoodEntryScreen}
        options={({ navigation }) => ({
          title: 'Add Food',
          presentation: 'modal',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginRight: 2 }}
              hitSlop={8}
            >
              <Ionicons name="close" size={width * 0.07} color="#222" />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
