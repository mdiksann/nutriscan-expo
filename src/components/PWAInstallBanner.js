import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NeumorphView } from './NeumorphView';

export const PWAInstallBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
      const isStandalone = window.navigator.standalone === true;
      
      if (isIOS && !isStandalone) {
        setIsVisible(true);
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <View style={styles.wrapper}>
      <NeumorphView style={styles.container}>
        <TouchableOpacity 
          style={styles.closeBtn} 
          onPress={() => setIsVisible(false)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color="#888" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait-outline" size={28} color="#2ecc71" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Install NutriScan App</Text>
            <Text style={styles.subtitle}>
              Tap <Ionicons name="share-outline" size={16} color="#2ecc71" /> below and select <Text style={styles.bold}>Add to Home Screen</Text> for standalone access.
            </Text>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-down" size={16} color="#2ecc71" />
        </View>
      </NeumorphView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // On web, fixed positions the element beautifully above browser viewport controls
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  container: {
    padding: 15,
    paddingTop: 18,
    borderRadius: 20,
    backgroundColor: '#E0E5EC',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E0E5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    // Slight shadow for inner button feel
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#A3B1C6',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#4A4A4A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    lineHeight: 16,
  },
  bold: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#4A4A4A',
  },
  arrowContainer: {
    alignItems: 'center',
    marginTop: 4,
  }
});
