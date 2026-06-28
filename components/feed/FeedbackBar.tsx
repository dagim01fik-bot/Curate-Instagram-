import React, { useState } from 'react';
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
  { icon: '♥', type: 'like', color: colors.positive, label: 'Like' },
  { icon: '✦', type: 'more_like_this', color: colors.accent, label: 'More' },
  { icon: '⏭', type: 'skip', color: colors.skip, label: 'Skip' },
  { icon: '🚫', type: 'not_interested', color: colors.negative, label: 'Not me' },
];

export function FeedbackBar({ onFeedback, likeCount }: FeedbackBarProps) {
  const [liked, setLiked] = useState(false);
  const [boosted, setBoosted] = useState(false);

  const handlePress = (type: FeedbackType) => {
    if (type === 'like') setLiked((v) => !v);
    if (type === 'more_like_this') setBoosted(true);
    onFeedback(type);
  };

  return (
    <View style={styles.bar}>
      {ACTIONS.map((action) => {
        const isLike = action.type === 'like';
        const isMore = action.type === 'more_like_this';
        const active = (isLike && liked) || (isMore && boosted);
        const bg = active ? action.color : action.color + '22';
        const fg = active ? '#fff' : action.color;
        const label = isLike
          ? (liked ? `${(likeCount ?? 0) + 1}` : likeCount ? `${likeCount}` : 'Like')
          : action.label;
        return (
          <TouchableOpacity
            key={action.type}
            style={[styles.btn, { backgroundColor: bg, borderColor: action.color + '44' }]}
            onPress={() => handlePress(action.type)}
            activeOpacity={0.75}
          >
            <Text style={[styles.icon, { color: fg }]}>{action.icon}</Text>
            <Text style={[styles.label, { color: fg }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
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
