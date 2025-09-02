// ProfileStack.js
// Stack navigator for the Profile section of the app

import React from 'react';
import { Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../../screens/ProfileScreen';
import EditProfileScreen from '../../screens/EditProfileScreen';
import BookmarksScreen from '../../screens/BookmarksScreen';
import RecipeScreen from '../../screens/RecipeScreen';
import EditGoalsScreen from '../../screens/EditGoalsScreen';
import AboutScreen from '../../screens/AboutScreen';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

export default function ProfileStack() {
  return (
    <Stack.Navigator>

      {/* Main Profile screen */}
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />

      {/* Edit profile screen */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }}
      />

      {/* Bookmarked recipes screen */}
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
        options={{ title: 'Bookmarks' }}
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
              style={{ marginRight: 4}}
              hitSlop={8}
            >
              <Ionicons name="close" size={width * 0.07} color="#222" />
            </Pressable>
          ),
          headerLeft: () => null,
        })}
      />

      {/* About us screen */}
      <Stack.Screen 
        name="AboutUs" 
        component={AboutScreen} 
        options={{ title: 'About Us' }}
      />

    </Stack.Navigator>
  );
}
