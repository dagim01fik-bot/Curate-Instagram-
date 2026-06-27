import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { ScheduleMode } from '../../types/preferences';

interface ScheduleBannerProps {
  schedule: ScheduleMode;
}

export function ScheduleBanner({ schedule }: ScheduleBannerProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.pill}
      onPress={() => router.push('/preferences/schedule')}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>🌅 {schedule.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
});
