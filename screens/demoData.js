import AsyncStorage from '@react-native-async-storage/async-storage';

export async function seedDemoData() {
  const demoData = {
    "user_dailyintake:2025-08-25": [
      {
        name: "Banana",
        brand: "Dole",
        serving: "1 piece",
        nutrients: { 
          "energy-kcal": 105, 
          proteins: 1.3, 
          fat: 0.3, 
          sugars: 14, 
          fiber: 3.1, 
          calcium: 6, 
          iron: 0.3,
          sodium: 1
        },
        source: "manual",
        timestamp: new Date("2025-08-25T08:00:00").toISOString(),
      },
      {
        name: "Chicken Breast",
        brand: "Generic",
        serving: "100 g",
        nutrients: { 
          "energy-kcal": 165, 
          proteins: 31, 
          fat: 3.6, 
          sugars: 0, 
          fiber: 0, 
          calcium: 15, 
          iron: 1,
          sodium: 74
        },
        source: "manual",
        timestamp: new Date("2025-08-25T12:30:00").toISOString(),
      },
      {
        name: "Broccoli",
        brand: "Fresh",
        serving: "1 cup",
        nutrients: { 
          "energy-kcal": 55, 
          proteins: 4.6, 
          fat: 0.6, 
          sugars: 2.2, 
          fiber: 5.1, 
          calcium: 62, 
          iron: 1,
          sodium: 49
        },
        source: "manual",
        timestamp: new Date("2025-08-25T19:00:00").toISOString(),
      },
    ],
    "user_dailyintake:2025-08-26": [
      {
        name: "Oatmeal",
        brand: "Quaker",
        serving: "1 cup",
        nutrients: { 
          "energy-kcal": 150, 
          proteins: 5, 
          fat: 3, 
          sugars: 1, 
          fiber: 4, 
          calcium: 187, 
          iron: 1.5,
          sodium: 2
        },
        source: "manual",
        timestamp: new Date("2025-08-26T07:45:00").toISOString(),
      },
      {
        name: "Almonds",
        brand: "Blue Diamond",
        serving: "28 g (23 nuts)",
        nutrients: { 
          "energy-kcal": 164, 
          proteins: 6, 
          fat: 14, 
          sugars: 1.2, 
          fiber: 3.5, 
          calcium: 76, 
          iron: 1.1,
          sodium: 0
        },
        source: "manual",
        timestamp: new Date("2025-08-26T14:00:00").toISOString(),
      },
    ],
  };

  // Write each key/value into AsyncStorage
  for (const [key, value] of Object.entries(demoData)) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  console.log("Demo data seeded!");
}
