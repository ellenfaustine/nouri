// goalsStorage.js
// Functions to get, set, and reset user nutrition goals

import AsyncStorage from '@react-native-async-storage/async-storage';

const goals_key = 'user_goals';

// Get saved goals (returns object or null if not set)
export async function getUserGoals() {
  try {
    const raw = await AsyncStorage.getItem(goals_key);
    return raw ? JSON.parse(raw) : null; // null means use app default goals
  } catch {
    return null;
  }
}

// Save user goals object
export async function setUserGoals(goalsObj) {
  await AsyncStorage.setItem(goals_key, JSON.stringify(goalsObj));
}

// Remove all saved goals (resets to default)
export async function resetUserGoals() {
  await AsyncStorage.removeItem(goals_key);
}
