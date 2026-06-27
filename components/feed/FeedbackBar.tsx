import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { FeedbackType } from '../../types/feedback';

interface FeedbackBarProps {
  onFeedback: (type: FeedbackType) => void;
  likeCount?: number;
}

interface ActionButton {
  icon: string;
  type: FeedbackType;
  color: string;
  label: string;
}

const ACTIONS: ActionButton[] = [
  { icon: '♥', type: 'like', color: colors.positive, label: '2.4k' },
  { icon: '✦', type: 'more_like_this', color: colors.accent, label: 'More' },
  { icon: '⏭', type: 'skip', color: colors.skip, label: 'Skip' },
  { icon: '🚫', type: 'not_interested', color: colors.negative, label: 'Not me' },
];

export function FeedbackBar({ onFeedback, likeCount }: FeedbackBarProps) {
  return (
    <View style={styles.bar}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.type}
          style={[styles.btn, { backgroundColor: action.color + '22', borderColor: action.color + '44' }]}
          onPress={() => onFeedback(action.type)}
          activeOpacity={0.75}
        >
          <Text style={[styles.icon, { color: action.color }]}>{action.icon}</Text>
          <Text style={[styles.label, { color: action.color }]}>
            {action.type === 'like' && likeCount ? `${likeCount}` : action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 10,
    alignItems: 'center',
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 2,
  },
  icon: {
    fontSize: 20,
    lineHeight: 22,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
