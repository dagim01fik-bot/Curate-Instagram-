import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface TopicPillProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress: () => void;
  small?: boolean;
}

export function TopicPill({ label, icon, selected, onPress, small }: TopicPillProps) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.selected, small && styles.small]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon ? <Text style={[styles.icon, small && styles.smallIcon]}>{icon}</Text> : null}
      <Text style={[styles.label, selected && styles.selectedLabel, small && styles.smallLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  icon: {
    fontSize: 16,
  },
  smallIcon: {
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedLabel: {
    color: colors.textPrimary,
  },
  smallLabel: {
    fontSize: 12,
  },
});
