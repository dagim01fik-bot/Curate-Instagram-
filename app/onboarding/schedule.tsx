import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { ScheduleQuickSetup } from '../../components/onboarding/ScheduleQuickSetup';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { ScheduleMode } from '../../types/preferences';
import { config } from '../../constants/config';

const DEFAULT_SCHEDULE: ScheduleMode = {
  id: 'morning-default',
  name: 'Morning Mode',
  topicIds: ['news', 'tech'],
  days: [1, 2, 3, 4, 5],
  startHour: config.DEFAULT_MORNING_START_HOUR,
  endHour: config.DEFAULT_MORNING_END_HOUR,
  enabled: true,
};

export default function ScheduleScreen() {
  const router = useRouter();
  const addSchedule = usePreferencesStore((s) => s.addSchedule);
  const [schedule, setSchedule] = useState<ScheduleMode>(DEFAULT_SCHEDULE);

  const handleSetup = () => {
    addSchedule(schedule);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Want a morning content mode?</Text>
          <Text style={styles.subtitle}>
            Set a time window with specific topics — great for news and focused reading.
          </Text>
        </View>

        <View style={styles.card}>
          <ScheduleQuickSetup
            schedule={schedule}
            onChange={(updates) => setSchedule((prev) => ({ ...prev, ...updates }))}
          />
        </View>

        <View style={styles.actions}>
          <Button label="Set it up" onPress={handleSetup} style={styles.primaryBtn} />
          <Button label="Skip for now" onPress={handleSkip} variant="ghost" style={styles.skipBtn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  header: { gap: 8 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  actions: { gap: 12 },
  primaryBtn: { width: '100%' },
  skipBtn: { width: '100%' },
});
