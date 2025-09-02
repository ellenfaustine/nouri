// AboutScreen.js
// Shows app info, developer details, and contact links

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, Pressable, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* App title and version */}
      <Text style={styles.appName}>Nouri</Text>
      <Text style={styles.version}>v1.0.0</Text>
      {/* App description */}
      <Text style={styles.desc}>
        Nouri is your companion for building healthy eating habits. Log meals, track your daily nutrition, and discover easy recipes. The app is designed to make balanced living simple, practical, and enjoyable.
      </Text>

      {/* Developer section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Developer</Text>
        <Text style={styles.body}>Ellen Faustine</Text>
        <Text style={styles.body}>University of London, Goldsmiths</Text>
        <Text style={styles.desc}>
          Hi! I’m Ellen, a Computer Science undergraduate who is passionate about practical technology that makes a real impact. I love building tools that help people make everyday life healthier and easier.
        </Text>
      </View>

      {/* Contact section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Contact</Text>
        <Pressable onPress={() => Linking.openURL('mailto:ellenfaustine831@gmail.com')}>
          <Text style={[styles.body, styles.link]}>ellenfaustine831@gmail.com</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL('mailto:faustine001@mymail.sim.edu.sg')}>
          <Text style={[styles.body, styles.link]}>faustine001@mymail.sim.edu.sg</Text>
        </Pressable>
      </View>

      {/* Copyright */}
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} Nouri. All rights reserved.
      </Text>
    </ScrollView>
  );
}

// Styles for the About screen layout and text
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: width * 0.04,  
    paddingTop: height * 0.06,         
  },
  appName: {
    fontSize: width * 0.1,                     
    fontFamily: 'font',
    color: '#78C841',
    marginBottom: height * 0.0025,           
    letterSpacing: width * 0.0038,             
    textShadowColor: 'rgba(60,90,20,0.07)',
    textShadowOffset: { width: width * 0.0025, height: width * 0.01 },  
    textShadowRadius: width * 0.03,          
  },
  version: {
    fontSize: width * 0.035,                   
    color: '#666',
    marginBottom: height * 0.025,              
  },
  desc: {
    fontSize: width * 0.04,                    
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: width * 0.005,          
    marginBottom: height * 0.0275,             
    lineHeight: width * 0.055,                 
  },
  section: {
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: width * 0.055,                   
    fontWeight: '700',
    marginTop: height * 0.01875,               
    marginBottom: height * 0.0125,             
    color: '#111',
  },
  body: {
    fontSize: width * 0.04,                    
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.00625,            
    paddingHorizontal: width * 0.005,          
  },
  link: {
    color: '#78C841',
    textDecorationLine: 'underline',
  },
  copyright: {
    marginTop: height * 0.03125,               
    fontSize: width * 0.0325,                  
    color: '#aaa',
    textAlign: 'center',
  },
});