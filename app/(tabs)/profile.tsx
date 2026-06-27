import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { clearFeedbackHistory } from '../../services/feedbackService';
import { config } from '../../constants/config';

export default function ProfileTab() {
  const router = useRouter();
  const followedTopicIds = usePreferencesStore((s) => s.followedTopicIds);
  const followedCreatorIds = usePreferencesStore((s) => s.followedCreatorIds);
  const blockedKeywords = usePreferencesStore((s) => s.blockedKeywords);

  const handleResetFeed = () => {
    Alert.alert(
      'Reset feed history',
      'This will clear all your like, skip, and dislike signals. Your topic and creator preferences will stay. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => clearFeedbackHistory(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ME</Text>
          </View>
          <Text style={styles.name}>Your Profile</Text>
          <Text style={styles.email}>curate@example.com</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{followedTopicIds.length}</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{followedCreatorIds.length}</Text>
            <Text style={styles.statLabel}>Creators</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{blockedKeywords.length}</Text>
            <Text style={styles.statLabel}>Blocked</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push('/preferences')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryActionIcon}>✦</Text>
          <View style={styles.primaryActionText}>
            <Text style={styles.primaryActionTitle}>My feed preferences</Text>
            <Text style={styles.primaryActionSub}>Topics, creators, keywords, schedules</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {[
            { label: 'Notifications', icon: '🔔' },
            { label: 'Privacy', icon: '🔒' },
            { label: 'About Curate', icon: 'ℹ️' },
          ].map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.rowIcon}>{item.icon}</Text>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.destructiveBtn} onPress={handleResetFeed}>
          <Text style={styles.destructiveText}>Reset my feed history</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Curate v{config.APP_VERSION}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40, gap: 24 },
  header: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  name: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  email: { fontSize: 14, color: colors.textSecondary },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stat: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  primaryActionIcon: { fontSize: 20, color: colors.accent },
  primaryActionText: { flex: 1, gap: 2 },
  primaryActionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  primaryActionSub: { fontSize: 12, color: colors.textSecondary },
  section: { gap: 2 },
  sectionTitle: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 6, paddingHorizontal: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    gap: 12,
    marginBottom: 4,
  },
  rowIcon: { fontSize: 18 },
  rowLabel: { flex: 1, fontSize: 15, color: colors.textPrimary },
  chevron: { fontSize: 18, color: colors.textMuted, fontWeight: '300' },
  destructiveBtn: {
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.negative + '40',
  },
  destructiveText: { fontSize: 15, color: colors.negative, fontWeight: '500' },
  version: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
});
