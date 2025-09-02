// recipesStorage.js
// Functions for fetching and storing recipes and categories

import AsyncStorage from '@react-native-async-storage/async-storage';

const api_key = '9ff4bb57f83f4eb6a40592d6e975edd5';

// Recipe filter categories for explore screen
export const recipeCategories = [
  { key: 'high_protein', label: 'High Protein', query: 'minProtein=20' },
  { key: 'low_cal', label: 'Low Calorie', query: 'maxCalories=400' },
  { key: 'low_carb', label: 'Low Carb', query: 'maxCarbs=20' },
  { key: 'high_fiber', label: 'High Fiber', query: 'minFiber=5' },
  { key: 'vegan', label: 'Vegan', query: 'diet=vegan' },
  { key: 'gluten_free', label: 'Gluten-Free', query: 'glutenFree=true' },
  { key: 'dairy_free', label: 'Dairy-Free', query: 'dairyFree=true' },
  { key: 'under_15_min', label: 'Under 15 Min', query: 'maxReadyTime=15' },
];

// Fetch recipes by category (with caching for 24h)
export async function getRecipes(categoryKey = null) {
  const now = Date.now();
  const storageKey = `explore_recipes_${categoryKey || 'default'}`;
  const category = recipeCategories.find(cat => cat.key === categoryKey);
  const query = category ? category.query : 'diet=healthy';

  // Try to load from cache first
  const cached = await AsyncStorage.getItem(storageKey);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (now - timestamp < 24 * 60 * 60 * 1000 && Array.isArray(data) && data.length > 0) {
      return data;
    }
  }

  // Fetch from API if no valid cache
  const url = `https://api.spoonacular.com/recipes/complexSearch?number=20&addRecipeInformation=true&includeNutrition=true&${query}&apiKey=${api_key}`;
  const res = await fetch(url);
  const data = await res.json();
  const results = Array.isArray(data) ? data : data.results || [];
  await AsyncStorage.setItem(storageKey, JSON.stringify({ timestamp: now, data: results }));
  return results;
}

// Fetch full recipe details by id (with caching for 24h)
export async function getRecipeDetails(recipeId) {
  const detailKey = `explore_recipe_detail_${recipeId}`;
  const now = Date.now();
  const cachedDetail = await AsyncStorage.getItem(detailKey);
  if (cachedDetail) {
    const { timestamp, data } = JSON.parse(cachedDetail);
    if (now - timestamp < 24 * 60 * 60 * 1000) return data;
  }
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${api_key}`;
  const res = await fetch(url);
  const data = await res.json();
  await AsyncStorage.setItem(detailKey, JSON.stringify({ timestamp: now, data }));
  return data;
}

// Remove all cached recipes and details
export async function clearAllRecipeCaches() {
  const keys = await AsyncStorage.getAllKeys();
  const exploreKeys = keys.filter(k => k.startsWith('explore_recipes_') || k.startsWith('explore_recipe_detail_'));
  if (exploreKeys.length > 0) await AsyncStorage.multiRemove(exploreKeys);
}
