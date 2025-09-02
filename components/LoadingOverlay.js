// LoadingOverlay.js
// Displays a fullscreen loading overlay with spinner and optional message

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Shows spinner and message
export default function LoadingOverlay({ visible, message }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#00C2FF" />
      {message && (
        <Text style={styles.text}>{message}</Text>
      )}
    </View>
  );
}

// Styles for the overlay and text
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  text: {
    color: '#fff',
    marginTop: height * 0.022,        
    fontSize: width * 0.0425,          
    fontWeight: '600',
  },
});