// SplashScreen.js
// Shows app splash screen with logo

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Centered app logo and background
export default function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Text style={styles.logoText}>Nouri</Text>
    </View>
  );
}

// Styles for splash screen layout and logo
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#78C841',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: width * 0.14,              
    fontFamily: 'font',
    color: '#fff',
    letterSpacing: width * 0.005,        
    textShadowColor: 'rgba(60,90,20,0.13)',
    textShadowOffset: { width: width * 0.0025, height: width * 0.01 },
    textShadowRadius: width * 0.04,     
  },
});
