// ScanScreen.js
// Screen for scanning food barcodes and logging nutrition

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import NutritionLabel from '../components/NutritionLabel';
import LoadingOverlay from '../components/LoadingOverlay';
import { logFoodEntry } from '../storage/nutritionStorage';
import { normalizeNutrientsFromOpenFoodFacts } from '../utils/nutrition'; 

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [permission, requestPermission] = useCameraPermissions();   // Camera permissions
  const [scanned, setScanned] = useState(false);                    // whether a barcode has been scanned
  const [loading, setLoading] = useState(false);                    // loading indicator for API requests
  const [product, setProduct] = useState(null);                     // scanned product data
  const [nutrients, setNutrients] = useState(null);                 // normalized nutrients from product
  const [modalVisible, setModalVisible] = useState(false);          // show nutrition modal

  // Request camera permission on mount if not already granted
  useEffect(() => {
    if (!permission) return;                 
    if (!permission.granted) requestPermission();
  }, [permission, requestPermission]);

  // Extract and normalize nutrients whenever a new product is set
  useEffect(() => {
    if (product) {
      setNutrients(normalizeNutrientsFromOpenFoodFacts(product));
    } else {
      setNutrients(null);
    }
  }, [product]);

  // Handle barcode scanning
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    setProduct(null);

    try {
      // Fetch product data from OpenFoodFacts API
      const url = `https://world.openfoodfacts.org/api/v2/product/${data}.json?fields=product_name,brands,serving_size,nutriments`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status !== 1 || !json.product) throw new Error('Product not found');
      setProduct(json.product);
      setModalVisible(true);
      // Haptic feedback for successful scan
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (e) {
      setScanned(false); // allow rescan if API fails
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Error', e.message || 'Could not find product. Try scanning again, or enter manually.');
    } finally {
      setLoading(false);
    }
  };

  // Log the scanned product to daily intake
  const addToDailyIntake = async () => {
    if (!product || !nutrients) return;

    await logFoodEntry({
      name: product.product_name || "Unnamed Food",
      brand: product.brands || '',
      serving: product.serving_size || '',
      nutrients,
      source: 'scan',
    });

    setModalVisible(false);
    setScanned(false);
    // Provide success feedback and navigate back
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Success',
      'This food has been added to your daily intake.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Render fallback UI if camera permission is denied
  if (permission && !permission.granted) {
    return (
      <View style={styles.requireAccessScreen}>
        <MaterialCommunityIcons name="camera-off" size={width * 0.16} color="#aaa" />
        <Text style={styles.requireAccessText}>
          Camera access is needed to scan barcodes.{"\n"}
          Please enable camera access in your device settings.
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow */}
      <Pressable 
        onPress={() => navigation.goBack()} 
        style={styles.arrowButton}
      >
        <Ionicons name="arrow-back" size={width * 0.07} color="white" />
      </Pressable>

      {/* Camera view with barcode scanner */}
      <CameraView
        style={{ flex: 1 }}
        autoFocus="on"
        onBarcodeScanned={isFocused && !scanned ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      >
        {/* Overlay frame for scanning */}
        <View style={styles.overlayContainer}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </CameraView>

      {/* Button to navigate to manual food entry */}
      <Pressable
      onPress={() => navigation.navigate('FoodEntry')}
      style={styles.manualButton}
    >
      <Text style={styles.manualButtonText}>
        No barcode? Add manually
      </Text>
    </Pressable>

      {/* Nutrition label modal for scanned product */}
      {modalVisible && nutrients && (
        <NutritionLabel
          visible={true}
          onClose={() => {
            setModalVisible(false);
            setScanned(false);
          }}
          get={(key) => nutrients[key]}
          name={product?.product_name}
          brand={product?.brands}
          serving={product?.serving_size}
          onAddToDailyIntake={addToDailyIntake}
        />
      )}

      {/* Loading overlay while fetching product data */}
      <LoadingOverlay visible={loading} message="Loading product..." />

    </View>
  );
}

// Styles for camera screen, overlay, and buttons
const styles = StyleSheet.create({
  requireAccessScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: width * 0.06,
  },
  requireAccessText: {
    fontSize: width * 0.042,
    color: '#222',
    textAlign: 'center',
    marginVertical: width * 0.045,
    fontWeight: '600',
  },
  goBackButton: {
    marginTop: width * 0.02,
  },
  goBackText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: width * 0.042,
  },
  arrowButton: {
    position: 'absolute',
    top: width * 0.14,
    left: width * 0.05,
    zIndex: 1,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.8,
  },
  corner: {
    position: 'absolute',
    width: width * 0.16,
    height: width * 0.16,
    borderColor: '#FF0000',
  },
  topLeft: {
    top: -width * 0.05,
    left: 0,
    borderTopWidth: width * 0.011,
    borderLeftWidth: width * 0.011,
    borderTopLeftRadius: width * 0.03,
  },
  topRight: {
    top: -width * 0.05,
    right: 0,
    borderTopWidth: width * 0.011,
    borderRightWidth: width * 0.011,
    borderTopRightRadius: width * 0.03,
  },
  bottomLeft: {
    bottom: width * 0.05,
    left: 0,
    borderBottomWidth: width * 0.011,
    borderLeftWidth: width * 0.011,
    borderBottomLeftRadius: width * 0.03,
  },
  bottomRight: {
    bottom: width * 0.05,
    right: 0,
    borderBottomWidth: width * 0.011,
    borderRightWidth: width * 0.011,
    borderBottomRightRadius: width * 0.03,
  },
  manualButton: {
    position: 'absolute',
    bottom: width * 0.23,
    width: width * 0.6,          
    alignSelf: 'center', 
    backgroundColor: '#00C2FF',
    borderRadius: width * 0.065,
    paddingVertical: width * 0.037,
    alignItems: 'center',
    elevation: 3,
  },
  manualButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.042,
  },
});