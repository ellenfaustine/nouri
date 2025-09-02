// ProfileScreen.js
// Displays user profile info and settings

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, Image, Pressable, SectionList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoadingOverlay from '../components/LoadingOverlay';
import { getProfile } from '../storage/profileStorage';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const profile = await getProfile();
        setUser(profile);
        setLoading(false);
      };
      loadProfile();
    }, [])
  );

  if (loading) {
    return <LoadingOverlay visible message="Loading profile..." />;
  }

  // Profile options
  const sections = [
    {
      title: 'ProfileOptions',
      data: [
        { key: 'bookmarks', label: 'Bookmarks', icon: 'bookmark-outline', onPress: () => navigation.navigate('Bookmarks') },
        { key: 'goals', label: 'Daily Goals', icon: 'create-outline', onPress: () => navigation.navigate('EditGoals') },
        { key: 'history', label: 'History', icon: 'book-outline', onPress: () => navigation.navigate('History') },
        { key: 'about', label: 'About Us', icon: 'information-circle-outline', onPress: () => navigation.navigate('AboutUs') },
      ],
    },
  ];

  // Render a profile option row
  const renderItem = ({ item }) => (
    <Pressable style={styles.row} onPress={item.onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={item.icon} size={width * 0.05} color="#333" />
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={width * 0.05} color="#999" />
    </Pressable>
  );

  return (
    <SafeAreaView 
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      {/* Profile header with avatar, name, and edit button */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar && user.avatar.trim() !== "" ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={width * 0.325} color="#ccc" />
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.name}>{user.name}</Text>
          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>

      {/* List of profile options */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        renderSectionHeader={() => null}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// Styles for the profile screen layout and components
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.025,           
    paddingBottom: height * 0.0225,       
    paddingHorizontal: width * 0.05,      
  },
  avatarContainer: {
    width: width * 0.325,                 
    height: width * 0.325,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.045,           
  },
  avatar: {
    width: width * 0.325,
    height: width * 0.325,
    borderRadius: width * 0.1625,        
    backgroundColor: '#eee',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.055,              
    fontWeight: '700',
    marginTop: height * 0.005,
    marginBottom: height * 0.008,        
    color: '#222',
    textAlign: 'left',
  },
  bio: {
    fontSize: width * 0.035,              
    color: '#555',
    marginBottom: height * 0.0125,        
    textAlign: 'left',
    paddingRight: width * 0.03,          
  },
  editButton: {
    backgroundColor: '#00C2FF',
    paddingHorizontal: width * 0.035,     
    paddingVertical: height * 0.009,      
    borderRadius: width * 0.05,           
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: width * 0.04,               
    color: '#fff',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.0175,     
  },
  rowLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: width * 0.03,                   
  },
  rowLabel: { 
    fontSize: width * 0.045,              
  },
  separator: { 
    height: 1, 
    backgroundColor: '#eee',
  },
  listContent: {
    paddingHorizontal: width * 0.06,     
  },
});