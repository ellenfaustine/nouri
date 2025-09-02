// NutritionLabel.js
// Modal for displaying nutrition facts for a food item

import { View, ScrollView, Pressable, StyleSheet, Dimensions, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pct, dailyValues } from '../utils/nutrition'; 

const { width, height } = Dimensions.get('window');

// Format numbers with max 2 decimals
function formatValue(val) {
  if (val == null) return "—";

  const num = Number(val);
  const str = val.toString();

  const decimalPart = str.split('.')[1];
  const decimals = decimalPart ? decimalPart.length : 0;

  const maxDecimals = Math.min(decimals, 2);

  return num.toFixed(maxDecimals);
}

export default function NutritionLabel({ visible, onClose, get, name, brand, serving, onAddToDailyIntake }) {
  // Extract nutrient values
  const calories = get("energy-kcal");
  const fat = get("fat");
  const satFat = get("saturated-fat");
  const transFat = get("trans-fat");
  const cholesterol = get("cholesterol");
  const sodium = get("sodium")
  const carbs = get("carbohydrates");
  const fiber = get("fiber");
  const sugars = get("sugars");
  const addedSugars = get("sugars-added");
  const protein = get("proteins");
  const vitaminD = get("vitamin-d");
  const calcium = get("calcium");
  const iron = get("iron");
  const potassium = get("potassium");

  // Row component for nutrient display
  const Row = ({ left, value, unit = "", right }) => (
    <View style={styles.row}>
      <Text style={styles.leftText}>
        <Text style={{ fontWeight: '700' }}>{left}</Text>
        {value != null ? ` ${value}${unit}` : " —"}
      </Text>
      {right != null && <Text style={styles.rightText}>{right} %</Text>}
    </View>
  );

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          {/* Close button */}
          <Pressable style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={width * 0.065} color="#222" />
          </Pressable>
          
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.labelContainer}>
              {/* Product info */}
              <Text style={styles.productName}>{name || 'Unnamed product'}</Text>
              {brand && <Text style={styles.brandName}>{brand}</Text>}

              {/* Nutrition Facts header */}
              <Text style={styles.labelHeader}>Nutrition Facts</Text>
              <View style={styles.thickDivider} />

              {/* Serving size */}
              <View style={styles.servingRow}>
                <Text style={styles.servingLabel}>Serving Size</Text>
                <Text style={styles.servingValue}>{serving || '—'}</Text>
              </View>

              <View style={styles.thinDivider} />
              <Text style={styles.serving}>Amount Per Serving</Text>

              {/* Calories */}
              <View style={styles.calRow}>
                <Text style={styles.calLabel}>Calories</Text>
              <Text style={styles.calValue}>
                {calories != null ? `${Math.round(calories)} kcal` : "—"}
              </Text>

              </View>
              <View style={styles.thinDivider} />
              <Text style={styles.dvHeader}>% Daily Value*</Text>

              {/* Nutrients */}
              <Row left="Total Fat" value={formatValue(fat)} unit=" g" right={pct(fat, dailyValues.fat_g)} />
              <Row left="  Saturated Fat" value={formatValue(satFat)} unit=" g" right={pct(satFat, dailyValues.satfat_g)} />
              <Row left="  Trans Fat" value={formatValue(transFat)} unit=" g" />
              <Row left="Cholesterol" value={formatValue(cholesterol)} unit=" mg" right={pct(cholesterol, dailyValues.cholesterol_mg)} />
              <Row left="Sodium" value={formatValue(sodium)} unit=" mg" right={pct(sodium, dailyValues.sodium_mg)} />
              <Row left="Total Carbohydrate" value={formatValue(carbs)} unit=" g" right={pct(carbs, dailyValues.carbs_g)} />
              <Row left="  Dietary Fiber" value={formatValue(fiber)} unit=" g" right={pct(fiber, dailyValues.fiber_g)} />
              <Row left="  Total Sugars" value={formatValue(sugars)} unit=" g" />
              <Row left="   Includes Added Sugars" value={formatValue(addedSugars)} unit=" g" right={pct(addedSugars, dailyValues.added_sugars_g)} />
              <Row left="Protein" value={formatValue(protein)} unit=" g" right={pct(protein, dailyValues.protein_g)}/>
              <View style={styles.thinDivider} />
              <Row left="Vitamin D" value={formatValue(vitaminD)} unit=" mcg" right={pct(vitaminD, dailyValues.vitaminD_mcg)} />
              <Row left="Calcium" value={formatValue(calcium)} unit=" mg" right={pct(calcium, dailyValues.calcium_mg)} />
              <Row left="Iron" value={formatValue(iron)} unit=" mg" right={pct(iron, dailyValues.iron_mg)} />
              <Row left="Potassium" value={formatValue(potassium)} unit=" mg" right={pct(potassium, dailyValues.potassium_mg)} />

              <View style={styles.thinDivider} />
              <Text style={styles.footnote}>*Percent Daily Values are based on a 2000 calorie diet.</Text>
            </View>
          </ScrollView>

          {/* Button to add food to daily intake */}
          {onAddToDailyIntake && (
            <Pressable style={styles.button} onPress={onAddToDailyIntake}>
              <Text style={styles.buttonText}>Add to Daily Intake</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Styles for modal and nutrient display
const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCard: {
    width: width * 0.92,
    height: height * 0.90,
    backgroundColor: '#fff',
    borderRadius: width * 0.04,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: width * 0.01 },
    shadowOpacity: 0.25,
    shadowRadius: width * 0.015,
    elevation: 5,
    alignSelf: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: width * 0.025,
    right: width * 0.025,
    padding: width * 0.015,
    zIndex: 1,
  },
  labelContainer: { 
    backgroundColor: '#fff', 
    padding: width * 0.04, 
    borderRadius: width * 0.025 
  },
  labelHeader: { 
    fontSize: width * 0.06, 
    fontWeight: '800', 
    marginTop: width * 0.02,
    marginBottom: width * 0.015 
  },
  thickDivider: { 
    height: width * 0.015, 
    backgroundColor: '#111', 
    marginVertical: width * 0.02 
  },
  thinDivider: { 
    height: 1, 
    backgroundColor: '#ddd', 
    marginVertical: width * 0.013 
  },
  productName: { 
    fontSize: width * 0.05, 
    fontWeight: 'bold', 
    marginTop: width * 0.038,
    marginBottom: width * 0.005 
  },
  brandName: { 
    fontSize: width * 0.035, 
    color: '#555', 
  },
  serving: { 
    fontSize: width * 0.032, 
    color: '#444', 
    marginBottom: width * 0.015 
  },
  servingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: width * 0.015,
  },
  servingLabel: { 
    fontSize: width * 0.035, 
    fontWeight: '600' 
  },
  servingValue: { 
    fontSize: width * 0.035, 
    color: '#000' 
  },
  calRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: width * 0.01 
  },
  calLabel: { 
    fontSize: width * 0.055, 
    fontWeight: '800' 
  },
  calValue: { 
    fontSize: width * 0.07, 
    fontWeight: '800' 
  },
  dvHeader: { 
    alignSelf: 'flex-end', 
    fontSize: width * 0.03, 
    color: '#444', 
    marginVertical: width * 0.005 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: width * 0.01 
  },
  leftText: { 
    fontSize: width * 0.036, 
    color: '#111' 
  },
  rightText: { 
    fontSize: width * 0.036, 
    fontWeight: '700', 
    color: '#111' 
  },
  footnote: { 
    fontSize: width * 0.029, 
    color: '#666',
    marginTop: width * 0.015 
  },
  button: {
    backgroundColor: '#00C2FF',
    paddingVertical: width * 0.040,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginTop: width * 0.03,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.04,
  }
});
