// HistoryScreen.js
// Screen to display a list of daily logged foods and their nutrition

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, SectionList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { getAllDailyIntakes } from '../storage/nutritionStorage';
import { formatFriendlyDate } from '../utils/date';
import NutritionLabel from '../components/NutritionLabel';

const width = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [sections, setSections] = useState([]);             // Sectioned logs by date
  const [selectedItem, setSelectedItem] = useState(null);   // Selected food for modal
  const [modalVisible, setModalVisible] = useState(false);  // Show nutrition label

  // Load daily logs when screen is focused
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const logs = await getAllDailyIntakes();  // Fetch all logs
        const formatted = logs
          .filter(log => Array.isArray(log.data))
          .sort((a, b) => b.date.localeCompare(a.date))
          .map(log => ({
            title: formatFriendlyDate(log.date),
            data: log.data,
          }));
        setSections(formatted);
      };
      load();
    }, [])
  );

  return (
    <SafeAreaView 
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      {/* Screen header */}
      <Text style={styles.header}>Nutrition History</Text>

      {/* Show message if no history */}
      {sections.length === 0 ? (
        <Text style={styles.noHistory}>No history yet</Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.name + index}
          // Section headers
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          // Food entries
          renderItem={({ item, index, section }) => (
            <Pressable
              onPress={() => {
                setSelectedItem(item);   // Select item for modal
                setModalVisible(true);
              }}
              style={[
                styles.entry,
                index === section.data.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={styles.entryRow}>
                <Text style={styles.entryText}>{item.name}</Text>
                <Text style={styles.entryTime}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              {item.brand && <Text style={styles.entryBrand}>{item.brand}</Text>}
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Nutrition label */}
      {modalVisible && selectedItem && (
        <NutritionLabel
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          get={(key) => selectedItem.nutrients?.[key]}
          name={selectedItem.name}
          brand={selectedItem.brand}
          serving={selectedItem.serving}
        />
      )}

    </SafeAreaView>
  );
}

// Styles for layout, sections, entries, and modal
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    color: "#111827",
    fontSize: width * 0.06,
    fontWeight: '700',
    marginTop: width * 0.035,
    marginBottom: width * 0.04,
    marginLeft: width * 0.05,
  },
  noHistory: {
    fontSize: width * 0.045,
    color: '#888',
    marginTop: width * 0.12,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#88D158',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.05,
  },
  entry: {
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  entryTime: {
    fontSize: width * 0.04,
    color: '#6b7280',
    marginLeft: width * 0.03,
  },
  entryBrand: {
    fontSize: width * 0.04,
    color: '#6b7280',
    marginTop: width * 0.005,
  },
});
