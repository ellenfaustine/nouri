// EditProfileScreen.js
// Allows user to edit profile info and avatar

import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Pressable, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { getProfile, setProfile } from '../storage/profileStorage';

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    bio: '',
    avatar: null,
  });

  // Load the saved profile when the screen mounts
  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setForm(profile);
        }
      } catch (e) {
        console.warn('Error loading profile', e);
      }
    })();
  }, []);

  // Pick an image for avatar
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.6,
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0].uri });
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      await setProfile(form);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (e) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Error', 'Could not save profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        {form.avatar ? (
          <Image
            source={{ uri: form.avatar }}
            style={styles.avatarImg}
          />
        ) : (
          <Ionicons name="person-circle" size={width * 0.3} color="#ccc" style={styles.avatarImg} />
        )}

        <Pressable style={styles.changeAvatarBtn} onPress={pickImage}>
          <Text style={styles.changeAvatarText}>Change Avatar</Text>
        </Pressable>
      </View>

      {/* Name input */}
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
          placeholder="Enter your name"
        />
      </View>

      {/* Bio input */}
      <View style={styles.field}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: height * 0.1, textAlignVertical: 'top' }]}
          value={form.bio}
          onChangeText={(t) => setForm({ ...form, bio: t })}
          placeholder="Tell us something about yourself..."
          multiline
        />
      </View>

      {/* Save button */}
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

// Styles for profile edit screen layout and fields
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,                 
    backgroundColor: '#fff',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: height * 0.025,          
  },
  avatarImg: {
    width: width * 0.3,                     
    height: width * 0.3,
    borderRadius: width * 0.15,            
    marginBottom: height * 0.0125,          
  },
  changeAvatarBtn: {
    backgroundColor: '#F1F1F3',
    borderRadius: width * 0.02,             
    paddingVertical: height * 0.0125,      
    paddingHorizontal: width * 0.055,       
    marginTop: height * 0.01,               
    alignItems: 'center',
    borderColor: '#E5E7EB',
  },
  changeAvatarText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: width * 0.0375,               
    letterSpacing: width * 0.00025,         
  },
  field: {
    marginBottom: height * 0.025,           
  },
  label: {
    fontSize: width * 0.035,                
    marginBottom: height * 0.0075,          
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.025,            
    paddingHorizontal: width * 0.03,       
    paddingVertical: height * 0.0125,      
    fontSize: width * 0.04,                 
    backgroundColor: '#fafafa',
  },
  saveButton: {
    backgroundColor: '#00C2FF',
    paddingVertical: height * 0.0175,       
    borderRadius: width * 0.025,            
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: width * 0.04,                 
  },
});