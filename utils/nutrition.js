// nutrition.js
// Nutrition constants, helpers, and normalization functions

// Default daily nutrition goals
export const defaultGoals = {
  proteins: 50,  
  fiber: 28,
  calcium: 1300,
  iron: 18,
  sugars: 50,    
  fat: 78,
  sodium: 2300,
  'energy-kcal': 2000,
};

// Nutrient definitions (for display, units, colors)
export const nutrients = [
  { key: 'proteins',   name: 'Protein',  unit: 'g',    color: '#00C2FF' },
  { key: 'fiber',      name: 'Fiber',    unit: 'g',    color: '#22C55E' },
  { key: 'calcium',    name: 'Calcium',  unit: 'mg',   color: '#38BDF8' },
  { key: 'iron',       name: 'Iron',     unit: 'mg',   color: '#A78BFA' },
  { key: 'sugars',     name: 'Sugar',    unit: 'g',    color: '#FF6A00' },
  { key: 'fat',        name: 'Fat',      unit: 'g',    color: '#78C841' },
  { key: 'sodium',     name: 'Sodium',   unit: 'mg',   color: '#6C63FF' },
  { key: 'energy-kcal',name: 'Calories', unit: 'kcal', color: '#FFB347' },
];

// Standard daily values for nutrition labels (2000 kcal diet)
export const dailyValues = {
  fat_g: 78,
  satfat_g: 20,
  cholesterol_mg: 300,
  sodium_mg: 2300,
  carbs_g: 275,
  fiber_g: 28,
  added_sugars_g: 50,
  protein_g : 50,
  vitaminD_mcg: 20,
  calcium_mg: 1300,
  iron_mg: 18,
  potassium_mg: 4700,
};

// Calculate percent daily value
export const pct = (amount, dailyValues) => {
  if (!dailyValues || amount == null) return null;
  return Math.round((amount / dailyValues) * 100);
};

// Convert values for display/normalization
export const g = (x) => (x == null ? null : Number(x));
export const mg = (x) => (x == null ? null : Number(x) * 1000);
export const mcg = (x) => (x == null ? null : Number(x) * 1000000);

// Get nutrient amount per serving from OpenFoodFacts API product object
const getPerServing = (product, nutrientName) => {
  const n = product?.nutriments || {};
  const servingField = `${nutrientName}_serving`;
  if (n[servingField] != null) return Number(n[servingField]);

  // If no direct value, calculate from per 100g value and serving size (if possible)
  const per100g = n[`${nutrientName}_100g`];
  if (per100g != null && product?.serving_size) {
    const match = product.serving_size.match(/([\d.]+)\s*g/i);
    if (match) {
      const servingSizeG = parseFloat(match[1]);
      return Number(per100g) * (servingSizeG / 100);
    }
  }
  return null;
};

// Normalize nutrients from an OpenFoodFacts product object
export function normalizeNutrientsFromOpenFoodFacts(product) {
  return {
    'energy-kcal': g(getPerServing(product, "energy-kcal")),     // kcal
    fat: g(getPerServing(product, "fat")),                       // g
    'saturated-fat': g(getPerServing(product, "saturated-fat")), // g
    'trans-fat': g(getPerServing(product, "trans-fat")),         // g
    cholesterol: mg(getPerServing(product, "cholesterol")),      // mg
    sodium: mg(
      getPerServing(product, "sodium") ??
      (getPerServing(product, "salt") != null ? getPerServing(product, "salt") * 0.4 : null)
    ),                                                           // mg
    carbohydrates: g(getPerServing(product, "carbohydrates")),   // g
    fiber: g(getPerServing(product, "fiber")),                   // g
    sugars: g(getPerServing(product, "sugars")),                 // g
    'sugars-added': g(getPerServing(product, "sugars-added") ?? getPerServing(product, "added-sugars")), // g
    proteins: g(getPerServing(product, "proteins")),             // g
    'vitamin-d': mcg(getPerServing(product, "vitamin-d")),       // mcg
    calcium: mg(getPerServing(product, "calcium")),              // mg
    iron: mg(getPerServing(product, "iron")),                    // mg
    potassium: mg(getPerServing(product, "potassium")),          // mg
  };
}

// Normalize nutrients from manual food entry form
export function normalizeNutrientsFromManual(form, num = Number) {
  return {
    'energy-kcal': num(form.calories),
    fat: num(form.fat),
    'saturated-fat': null,
    'trans-fat': null,
    cholesterol: null,
    sodium: num(form.sodiumMg),
    carbohydrates: null,
    fiber: num(form.fiber),
    sugars: num(form.sugars),
    'sugars-added': null,
    proteins: num(form.protein),
    'vitamin-d': null,
    calcium: num(form.calciumMg),
    iron: num(form.ironMg),
    potassium: null,
  };
}

// Normalize nutrients from Spoonacular recipe API object
export function normalizeNutrientsFromSpoonacular(recipe) {
  const get = (nutName) => {
    const item = recipe.nutrition?.nutrients?.find(n => n.name.toLowerCase() === nutName.toLowerCase());
    return item ? Number(item.amount) : null;
  };

  return {
    'energy-kcal': get("Calories"),
    fat: get("Fat"),
    'saturated-fat': get("Saturated Fat"),
    'trans-fat': get("Trans Fat"),
    cholesterol: get("Cholesterol"),
    sodium: get("Sodium"),
    carbohydrates: get("Carbohydrates"),
    fiber: get("Fiber"),
    sugars: get("Sugar"),
    'sugars-added': get("Added Sugar"),
    proteins: get("Protein"),
    'vitamin-d': get("Vitamin D"),
    calcium: get("Calcium"),
    iron: get("Iron"),
    potassium: get("Potassium"),
  };
}
