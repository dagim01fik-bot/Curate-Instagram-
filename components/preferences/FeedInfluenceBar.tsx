import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { computeInfluenceBreakdown } from '../../utils/scoreUtils';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useFeedStore } from '../../store/useFeedStore';

export function FeedInfluenceBar() {
  const preferences = usePreferencesStore((s) => ({
    followedTopicIds: s.followedTopicIds,
    followedCreatorIds: s.followedCreatorIds,
    blockedKeywords: s.blockedKeywords,
    boostedKeywords: s.boostedKeywords,
    blockedCreatorIds: s.blockedCreatorIds,
    blockedTopicIds: s.blockedTopicIds,
    schedules: s.schedules,
  }));
  const feedbackHistory = useFeedStore((s) => s.feedbackHistory);
  const breakdown = computeInfluenceBreakdown(preferences, feedbackHistory);

  const segments = [
    { label: 'Topics', pct: breakdown.topics, color: colors.accent },
    { label: 'Creators', pct: breakdown.creators, color: colors.positive },
    { label: 'History', pct: breakdown.history, color: colors.skip },
    { label: 'Schedule', pct: breakdown.schedule, color: colors.negative },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's influencing your feed</Text>
      <View style={styles.bar}>
        {segments.map((seg, i) => (
          <View
            key={i}
            style={[styles.segment, { flex: seg.pct, backgroundColor: seg.color }]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendText}>{seg.label} {seg.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  segment: {
    borderRadius: 4,
    minWidth: 4,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
