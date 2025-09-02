// ExploreStack.js
// Stack navigator for the Explore section of the app

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ExploreScreen from '../../screens/ExploreScreen';
import RecipeScreen from '../../screens/RecipeScreen';

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator>
      {/* Main Explore screen */}
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />

      {/* Recipe detail screen */}
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeScreen}
        options={{ 
          headerShown: false, 
          presentation: 'modal' 
        }}
      />

    </Stack.Navigator>
  );
}
