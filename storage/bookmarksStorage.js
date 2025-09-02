// bookmarksStorage.js
// Functions for saving, loading, and updating bookmarked recipes

import AsyncStorage from '@react-native-async-storage/async-storage';

const bookmark_key = 'user_bookmarks';

// Get all bookmarked recipes (returns an array)
export async function getBookmarks() {
  const raw = await AsyncStorage.getItem(bookmark_key);
  return raw ? JSON.parse(raw) : [];
}

// Save the full list of bookmarks
export async function setBookmarks(list) {
  await AsyncStorage.setItem(bookmark_key, JSON.stringify(list));
}

// Add a recipe to bookmarks
export async function addBookmark(recipe) {
  const bookmarks = await getBookmarks();
  if (!bookmarks.some(r => r.id === recipe.id)) {
    bookmarks.push(recipe);
    await setBookmarks(bookmarks);
  }
}

// Remove a recipe from bookmarks by id
export async function removeBookmark(recipeId) {
  let bookmarks = await getBookmarks();
  bookmarks = bookmarks.filter(r => r.id !== recipeId);
  await setBookmarks(bookmarks);
}
