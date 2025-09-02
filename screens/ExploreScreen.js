// ExploreScreen.js
// Displays a list of recipe categories and recipe results

import { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { recipeCategories, getRecipes } from '../storage/recipesStorage';
import LoadingOverlay from '../components/LoadingOverlay';
import RecipeCard from '../components/RecipeCard';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Fetch recipes whenever selected category changes
  useEffect(() => {
    setLoading(true);
    getRecipes(selected)
      .then((data) => {
        // Shuffle recipes for variety
        const shuffled = data.sort(() => Math.random() - 0.5);
        setRecipes(shuffled);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <SafeAreaView 
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      {/* Section header */}
      <Text style={styles.sectionTitle}>Explore Recipes</Text>

      {/* Category filter bubbles */}
      {!loading && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ height: width * 0.15 }}
          contentContainerStyle={styles.bubbleRow}
        >
          {recipeCategories.map(cat => (
            <Pressable
              key={cat.key}
              style={[styles.bubble, selected === cat.key && styles.bubbleSelected]}
              onPress={() => setSelected(selected === cat.key ? null : cat.key)}
            >
              <Text style={[styles.bubbleText, selected === cat.key && { color: '#FFFFFF' }]}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Show loading spinner or recipes list */}
      {loading ? ( 
        <LoadingOverlay visible message="Loading recipes..." /> 
      ) : (
        <FlatList
          key={selected}
          data={recipes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <RecipeCard recipe={item} animationDelay={index * 120} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>

  );
}

// Stylesheet for explore screen layout, category bubbles, and recipe list
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: height * 0.015,                
  },
  sectionTitle: {
    fontSize: width * 0.06,                   
    fontWeight: '700',
    color: "#111827",
    marginBottom: height * 0.005,            
    paddingHorizontal: width * 0.05,           
    paddingBottom: height * 0.012,           
  },
  list: {
    paddingHorizontal: width * 0.04,           
    paddingBottom: height * 0.03,             
  },
  bubbleRow: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,           
    paddingBottom: height * 0.012,             
    alignItems: 'center',
  },
  bubble: {
    paddingVertical: width * 0.02,             
    paddingHorizontal: width * 0.04,           
    backgroundColor: '#E5E7EB',
    borderRadius: width * 0.05,                
    marginHorizontal: width * 0.0075,        
    minHeight: width * 0.095,                  
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF0F2',
  },
  bubbleSelected: {
    backgroundColor: '#88D158',
    borderColor: '#88D158',
  },
  bubbleText: {
    fontSize: width * 0.0325,                  
    fontWeight: '600',
    color: '#111827',
    lineHeight: width * 0.04,                  
  },
});
