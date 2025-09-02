// BookmarksScreen.js
// Shows a list of bookmarked recipes

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native';

import { getBookmarks } from '../storage/bookmarksStorage';
import LoadingOverlay from '../components/LoadingOverlay';
import RecipeCard from '../components/RecipeCard';

const { width, height } = Dimensions.get('window');

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from storage
  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const list = await getBookmarks();
      setBookmarks(list);
    } catch (e) {
      console.error("Error loading bookmarks:", e);
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookmarks when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Show loading spinner */}
      <LoadingOverlay visible={loading} message="Loading bookmarks..." />

      {/* Show empty state if no bookmarks */}
      {!loading && bookmarks.length === 0 ? (
        <Text style={styles.emptyText}>No bookmarks yet.</Text>
      ) : null}

      {/* Show bookmarks list */}
      {!loading && bookmarks.length > 0 && (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <RecipeCard recipe={item} animationDelay={index * 100} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// Styles for the bookmarks screen
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: height * 0.05,     
    fontSize: width * 0.04,       
    color: '#888',
  },
  listContent: {
    paddingHorizontal: width * 0.04, 
    paddingBottom: height * 0.03,    
  },
});
