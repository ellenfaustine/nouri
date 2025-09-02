// profileStorage.js
// Functions for saving and loading user profile info

import AsyncStorage from '@react-native-async-storage/async-storage';

const profile_key = 'user_profile';

// Get saved profile, or return default if not set
export async function getProfile() {
  let json = await AsyncStorage.getItem(profile_key);
  if (json) return JSON.parse(json);

  // Default profile if none found
  const profile = {
    name: 'User',
    avatar: null,
    bio: 'Making every bite count',
  };
  await AsyncStorage.setItem(profile_key, JSON.stringify(profile));
  return profile;
}

// Save the full profile (replaces any existing profile)
export async function setProfile(profile) {
  return AsyncStorage.setItem(profile_key, JSON.stringify(profile));
}

// Update profile (merge fields)
export async function updateProfile(updates) {
  const profile = await getProfile();
  const merged = { ...profile, ...updates };
  await setProfile(merged);
  return merged;
}