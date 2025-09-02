// RecipeCard.js
// Displays a recipe card with image, title, cooking time, and dietary tags with fade-in animation

import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

import timeIcon from '../assets/icons/time.png';
import dairyIcon from '../assets/icons/dairy.png';
import glutenIcon from '../assets/icons/gluten.png';
import veganIcon from '../assets/icons/vegan.png';

const { width } = Dimensions.get('window');

export default function RecipeCard({ recipe, style, animationDelay = 0 }) {
  const navigation = useNavigation();

  // Animated values for entrance effect
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Animate card on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay: animationDelay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay: animationDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationDelay, translateY, opacity]);

  return (
    <Animated.View style={[styles.card, style, { opacity, transform: [{ translateY }] }]}>
      {/* Navigate to recipe detail on press */}
      <Pressable onPress={() => navigation.navigate('RecipeDetail', { id: recipe.id })}>
        {/* Recipe image */}
        <Image source={{ uri: recipe.image }} style={styles.cardImage} resizeMode="cover" />

        {/* Overlay with title, time, and tags */}
        <BlurView intensity={24} tint="light" style={styles.infoOverlay}>
          <View style={styles.infoContent}>
            {/* Recipe title */}
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
              {recipe.title}
            </Text>

            {/* Cooking time */}
            <View style={styles.cardDetailRow}>
              {recipe.readyInMinutes !== undefined && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                  <Image source={timeIcon} style={styles.timeIcon} />
                  <Text style={styles.cardDetail}> {recipe.readyInMinutes} min</Text>
                </View>
              )}
            </View>

            {/* Dietary tags */}
            <View style={styles.tagRow}>
              {recipe.vegan && (
                <View style={styles.tag}>
                  <Image source={veganIcon} style={styles.icon} />
                  <Text style={styles.tagText}>Vegan</Text>
                </View>
              )}
              {recipe.glutenFree && (
                <View style={styles.tag}>
                  <Image source={glutenIcon} style={styles.icon} />
                  <Text style={styles.tagText}>Gluten-Free</Text>
                </View>
              )}
              {recipe.dairyFree && (
                <View style={styles.tag}>
                  <Image source={dairyIcon} style={styles.icon} />
                  <Text style={styles.tagText}>Dairy-Free</Text>
                </View>
              )}
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

// Styles for card layout, image, overlay, and tags
const styles = StyleSheet.create({
  card: {
    width: width * 0.92,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: width * 0.032,
    marginBottom: width * 0.032,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: width * 0.005 },
    shadowRadius: width * 0.011,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1.25,
    borderTopLeftRadius: width * 0.032,
    borderTopRightRadius: width * 0.032,
  },
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: width * 0.032,
    borderBottomRightRadius: width * 0.032,
    overflow: 'hidden',
    zIndex: 3,
  },
  infoContent: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: width * 0.032,
    paddingVertical: width * 0.027,
    alignItems: 'flex-start',     
  },
  cardTitle: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#111',        
    marginBottom: width * 0.011,
    lineHeight: width * 0.053,          
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: width * 0.021,
  },
  cardDetail: {
    fontSize: width * 0.032,
    color: '#111',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1EDBE',
    borderRadius: width * 0.027,
    paddingHorizontal: width * 0.019,
    paddingVertical: width * 0.005,
    marginRight: width * 0.013,
    marginBottom: width * 0.005,
  },
  icon: {
    width: width * 0.04,
    height: width * 0.04,
    marginRight: width * 0.011,
  },
  tagText: {
    fontSize: width * 0.029,
    fontWeight: '500',
    color: '#25561C',
  },
  timeIcon: {
    width: width * 0.043,
    height: width * 0.043,
    marginRight: 0,
  },
});