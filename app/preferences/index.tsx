import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { FeedInfluenceBar } from '../../components/preferences/FeedInfluenceBar';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { clearFeedbackHistory } from '../../services/feedbackService';

interface NavRow {
  label: string;
  icon: string;
  subtitle: string;
  route: '/preferences/topics' | '/preferences/creators' | '/preferences/keywords' | '/preferences/schedule';
}

export default function PreferencesIndex() {
  const router = useRouter();
  const followedTopicIds = usePreferencesStore((s) => s.followedTopicIds);
  const blockedTopicIds = usePreferencesStore((s) => s.blockedTopicIds);
  const followedCreatorIds = usePreferencesStore((s) => s.followedCreatorIds);
  const blockedCreatorIds = usePreferencesStore((s) => s.blockedCreatorIds);
  const boostedKeywords = usePreferencesStore((s) => s.boostedKeywords);
  const blockedKeywords = usePreferencesStore((s) => s.blockedKeywords);
  const schedules = usePreferencesStore((s) => s.schedules);

  const activeSchedules = schedules.filter((s) => s.enabled);
  const scheduleNames = activeSchedules.map((s) => s.name).join(', ');

  const navRows: NavRow[] = [
    {
      label: 'Topics',
      icon: '🏷️',
      subtitle: `${followedTopicIds.length} followed · ${blockedTopicIds.length} blocked`,
      route: '/preferences/topics',
    },
    {
      label: 'Creators',
      icon: '👥',
      subtitle: `${followedCreatorIds.length} followed · ${blockedCreatorIds.length} blocked`,
      route: '/preferences/creators',
    },
    {
      label: 'Keywords',
      icon: '🔍',
      subtitle: `${boostedKeywords.length} boosted · ${blockedKeywords.length} blocked`,
      route: '/preferences/keywords',
    },
    {
      label: 'Scheduled modes',
      icon: '⏰',
      subtitle: activeSchedules.length > 0 ? `${activeSchedules.length} active · ${scheduleNames}` : 'None active',
      route: '/preferences/schedule',
    },
  ];

  const handleResetHistory = () => {
    Alert.alert(
      'Reset feedback history',
      'Clear all your feedback signals? Your preferences will stay.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => clearFeedbackHistory() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>My feed</Text>
        <FeedInfluenceBar />

        <View style={styles.navList}>
          {navRows.map((row) => (
            <TouchableOpacity
              key={row.route}
              style={styles.navRow}
              onPress={() => router.push(row.route)}
              activeOpacity={0.7}
            >
              <View style={styles.navIcon}>
                <Text style={styles.navIconText}>{row.icon}</Text>
              </View>
              <View style={styles.navText}>
                <Text style={styles.navLabel}>{row.label}</Text>
                <Text style={styles.navSub}>{row.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.resetLink} onPress={handleResetHistory}>
          <Text style={styles.resetText}>Reset feedback history</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 20 },
  heading: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: -4 },
  navList: { gap: 4 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 14,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconText: { fontSize: 20 },
  navText: { flex: 1, gap: 2 },
  navLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  navSub: { fontSize: 12, color: colors.textSecondary },
  chevron: { fontSize: 20, color: colors.textMuted },
  resetLink: { alignSelf: 'center', padding: 12 },
  resetText: { fontSize: 14, color: colors.textMuted },
});
