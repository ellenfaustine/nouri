// App.js
// App entry point: loads fonts, shows splash, sets up notifications, and renders navigation

import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';
import SplashScreen from './components/SplashScreen'; 

// Set up notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // Load custom font
  const [fontsLoaded] = useFonts({
    font: require('./assets/fonts/Avigea.ttf'),
  });

  // State for showing splash screen
  const [showSplash, setShowSplash] = useState(true);

  // Show splash for 1.2s after fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setShowSplash(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  // Set up a daily notification reminder at 12:00pm
  useEffect(() => {
    async function setupReminders() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "What's for lunch?",
          body: "Take a minute to log your meal or snack in the app!",
        },
        trigger: { hour: 12, minute: 0, repeats: true }, // 12:00 pm every day
      });
    }
    setupReminders();
  }, []);

  // Don't render anything until font is ready
  if (!fontsLoaded) return null;

  // Show splash screen after font loads
  if (showSplash) {
    return <SplashScreen />;
  }

  // Main app navigation
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}