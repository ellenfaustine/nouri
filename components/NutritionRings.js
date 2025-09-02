// NutritionRings.js
// Displays circular nutrient intake rings with animated progress and center labels showing nutrient name and amount

import React, { useEffect, useRef, useState } from 'react';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

// Create animated version of SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function NutritionRings({ size, values }) {
  // Calculations for ring sizes and layout
  const strokeWidth = size * 0.08;
  const ringSpacing = size * 0.09;
  const center = size / 2;
  const baseRadius = center - strokeWidth;

  // State for which nutrient is selected
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Create one animated value per ring
  const animRefs = useRef(values.map(() => new Animated.Value(0)));
  if (animRefs.current.length !== values.length) {
    animRefs.current = values.map((_, i) => animRefs.current[i] ?? new Animated.Value(0));
  }

  // Animate each ring whenever values change
  useEffect(() => {
    const animations = animRefs.current.map((anim, i) =>
      Animated.timing(anim, {
        toValue: values[i].percentage,     // animate to percentage
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      })
    );
    Animated.stagger(140, animations).start();   // Stagger for smooth effect
  }, [values]);

  return (
    <Svg width={size} height={size}>
      {values.map((v, i) => {
        const radius = baseRadius - i * ringSpacing;
        const circumference = 2 * Math.PI * radius;
        const offset = animRefs.current[i].interpolate({
          inputRange: [0, 100],
          outputRange: [circumference, 0],
        });

        return (
          <G key={i} onPress={() => setSelectedIndex(i)}>
            {/* Background ring */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Animated progress ring */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke={v.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90, ${center}, ${center})`}
            />
          </G>
        );
      })}

      {/* Center labels */}
      {/* Display selected nutrient name */}
      <SvgText 
        x={center} 
        y={center - (size * 0.0056)} 
        fontSize={size * 0.047} 
        fontWeight="700" 
        textAnchor="middle" 
        fill="#222"
      >
        {values[selectedIndex].name}
      </SvgText>
      {/* Display current intake value for selected nutrient */}
      <SvgText 
        x={center} 
        y={center + (size * 0.044)} 
        fontSize={size * 0.039} 
        textAnchor="middle" 
        fill="#666"
      >
        {`${values[selectedIndex].current}${values[selectedIndex].unit}`}
      </SvgText>
    </Svg>
  );
}
