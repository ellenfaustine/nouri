// WeekSelector.js
// Horizontal week date selector with previous/next navigation

import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function WeekSelector({ weekStart, weekDays, selectedDate, onSelectDate, onPrevWeek, onNextWeek, styles: parentStyles = {}}) {
  return (
    <>
      {/* Month and year label */}
      <Text style={[styles.monthLabel, parentStyles.monthLabel]}>
        {weekStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      </Text>

      {/* Main week selector row */}
      <View style={[styles.weekSelector, parentStyles.weekSelector]}>
        {/* Previous week arrow */}
        <Pressable onPress={onPrevWeek}>
          <Text style={styles.weekArrow} accessibilityLabel="Previous week">‹</Text>
        </Pressable>

        {/* 7 day bubbles */}
        <View style={styles.dayRow}>
          {weekDays.map((d) => {
            const key = d.toISOString().split('T')[0];
            const isSelected = key === selectedDate.toISOString().split('T')[0];
            const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
            const dayNum = d.getDate();

            return (
              <Pressable
                key={key}
                onPress={() => onSelectDate(d)}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              >
                {/* Day short name */}
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{dow}</Text>
                 {/* Day number */}
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>{dayNum}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Next week arrow */}
        <Pressable onPress={onNextWeek}>
          <Text style={styles.weekArrow} accessibilityLabel="Next week">›</Text>
        </Pressable>
      </View>
    </>
  );
}

// Styles for week selector and day bubbles
const styles = StyleSheet.create({
  monthLabel: {
    fontSize: width * 0.042,           
    fontWeight: '600',
    color: '#111827',
    marginBottom: width * 0.01,       
    textAlign: 'center',
  },
  weekSelector: {
    width: width,
    paddingHorizontal: width * 0.04,  
    paddingBottom: width * 0.02,      
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekArrow: {
    fontSize: width * 0.07,           
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: width * 0.02,  
  },
  dayRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.015,   
    paddingHorizontal: width * 0.015, 
    width: width * 0.11,              
    height: width * 0.11,             
    borderRadius: width * 0.055,      
  },
  dayItemSelected: {
    backgroundColor: '#78C841',
  },
  dayText: {
    fontSize: width * 0.032,           
    fontWeight: '500',
    color: '#6b7280',
  },
  dayNum: {
    fontSize: width * 0.036,          
    fontWeight: '800',
    color: '#111827',
  },
  dayTextSelected: {
    color: '#fff',
  },
  dayNumSelected: {
    color: '#fff',
  },
});
