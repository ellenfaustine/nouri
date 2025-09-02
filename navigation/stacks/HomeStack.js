// HomeStack.js
// Stack navigator for the Home section of the app

import React from 'react';
import { Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/HomeScreen';
import EditGoalsScreen from '../../screens/EditGoalsScreen';
import RecipeScreen from '../../screens/RecipeScreen';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

export default function HomeStack() {
  return (
    <Stack.Navigator>
      {/* Main Home screen */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* Edit Daily Goals screen with a close button in the header */}
      <Stack.Screen
        name="EditGoals"
        component={EditGoalsScreen}
        options={({ navigation }) => ({
          title: 'Edit Daily Goals',
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
          headerLeft: () => null,
        })}
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
