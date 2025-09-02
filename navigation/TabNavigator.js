// TabNavigator.js
// Bottom tab navigator for the main app, including Home, Explore, Scan, History, and Profile tabs

import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './stacks/HomeStack';
import ExploreStack from './stacks/ExploreStack';
import ScanStack from './stacks/ScanStack';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileStack from './stacks/ProfileStack';

import FloatingScanButton from '../components/FloatingScanButton';

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get('window');
const tabIconSize = width * 0.07; 

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Home tab */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={tabIconSize} color={color} />
          ),
        }}
      />

      {/* Explore tab */}
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={tabIconSize} color={color} />
          ),
        }}
      />

      {/* Center floating Scan button */}
      <Tab.Screen 
        name="Scan" 
        component={ScanStack} 
        options={{
          tabBarLabel: '',
          tabBarStyle: { display: 'none' },
          tabBarButton: (props) => <FloatingScanButton {...props} />, // uses props.onPress to navigate
        }} 
      />

      {/* History tab */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={tabIconSize} color={color} />
          ),
        }}
      />

      {/* Profile tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={tabIconSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FAFAFA',
    borderTopColor: '#EEF0F2',
    height: height * 0.12,
    paddingBottom: height * 0.01,
  },
});

