import React from 'react';
import { View, StyleSheet } from 'react-native';

export const NeumorphView = ({ children, style, isPressed = false }) => {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const borderRadius = flattenedStyle.borderRadius || 15;

  return (
    <View style={style}>
      <View style={[
        StyleSheet.absoluteFill,
        styles.outerShadow,
        isPressed && styles.pressedState,
        { borderRadius }
      ]} />
      <View style={[
        StyleSheet.absoluteFill,
        styles.innerShadow,
        isPressed && styles.pressedState,
        { borderRadius }
      ]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  outerShadow: {
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#A3B1C6',
    backgroundColor: '#E0E5EC',
    elevation: 5,
  },
  innerShadow: {
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#FFFFFF',
    backgroundColor: '#E0E5EC',
    elevation: 5,
  },
  pressedState: {
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
  }
});
