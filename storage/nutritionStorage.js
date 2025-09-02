// nutritionStorage.js
// Functions for logging, and fetching food/nutrition entries

import { toDateStr } from '../utils/date';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Build the storage key for a given date
const getKeyForDate = (dateStr) => `user_dailyintake:${dateStr}`;

// Get the storage key for today
const getTodayKey = () => getKeyForDate(toDateStr());

// Add a new food entry to today's log
export async function logFoodEntry({
  name,
  brand,
  serving,
  nutrients = {},
  source = 'manual',
  date = new Date(),
}) {
  try {
    const key = getKeyForDate(toDateStr(date));
    const existing = await AsyncStorage.getItem(key);
    const current = Array.isArray(JSON.parse(existing)) ? JSON.parse(existing) : [];

    const now = new Date();

    // Create food entry object
    const entry = {
      name,
      brand,
      serving,
      source,
      timestamp: now.toISOString(),
      date: toDateStr(date),
      nutrients,
    };

    current.push(entry);
    await AsyncStorage.setItem(key, JSON.stringify(current));
  } catch (e) {
    console.error('Error logging food entry', e);
  }
}

// Get the sum of all nutrients for today
export async function getDailyIntake() {
  try {
    const raw = await AsyncStorage.getItem(getTodayKey());
    const entries = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];

    return entries.reduce((totals, { nutrients }) => {
      for (const [k, v] of Object.entries(nutrients)) {
        totals[k] = (totals[k] || 0) + v;
      }
      return totals;
    }, {});
  } catch (e) {
    console.error('Error calculating daily intake', e);
    return {};
  }
}

// Get all food entries for a specific date
export async function getIntakeByDate(dateStr) {
  try {
    const raw = await AsyncStorage.getItem(getKeyForDate(dateStr));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading intake by date', e);
    return [];
  }
}

// Delete today's food log
export async function resetDailyIntake() {
  try {
    await AsyncStorage.removeItem(getTodayKey());
  } catch (e) {
    console.error('Error resetting daily intake', e);
  }
}

// Get all daily logs
export async function getAllDailyIntakes() {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const keys = allKeys.filter((k) => k.startsWith('user_dailyintake:'));
    const entries = await AsyncStorage.multiGet(keys);

    return entries.map(([key, value]) => ({
      date: key.replace('user_dailyintake:', ''),
      data: JSON.parse(value),
    }));
  } catch (e) {
    console.error('Error reading all daily intakes', e);
    return [];
  }
}
