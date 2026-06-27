import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface BadgeProps {
  label: string;
  color?: string;
  style?: ViewStyle;
  small?: boolean;
}

export function Badge({ label, color = colors.accent, style, small }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }, style]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 10,
  },
});
