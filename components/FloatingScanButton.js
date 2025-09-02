// FloatingScanButton.js
// Circular floating button for scan action

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// shows a floating scan icon button
export default function FloatingScanButton({ onPress }) {
  return (
    <View style={styles.floatingOuter}>
      <View style={styles.floatingWrapper}>
        <Ionicons name="scan" size={width * 0.09} color="white" onPress={onPress} />
      </View>
    </View>
  );
}

// Styles for floating scan button layout
const styles = StyleSheet.create({
  floatingOuter: {
    position: 'absolute',
    top: -height * 0.02,            
    alignSelf: 'center',
  },
  floatingWrapper: {
    backgroundColor: '#78C841',
    width: width * 0.18,            
    height: width * 0.18,
    borderRadius: width * 0.09,     
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});