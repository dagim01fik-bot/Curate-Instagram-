import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { colors } from '../../constants/colors';
import { ScheduleMode } from '../../types/preferences';
import { TopicGrid } from './TopicGrid';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface Props {
  schedule: ScheduleMode;
  onChange: (updates: Partial<ScheduleMode>) => void;
}

export function ScheduleQuickSetup({ schedule, onChange }: Props) {
  const [showTopics, setShowTopics] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Enabled</Text>
        <Switch
          value={schedule.enabled}
          onValueChange={(v) => onChange({ enabled: v })}
          trackColor={{ true: colors.accent }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Days</Text>
        <View style={styles.daysRow}>
          {DAY_LABELS.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dayPill, schedule.days.includes(i) && styles.dayPillSelected]}
              onPress={() => {
                const next = schedule.days.includes(i)
                  ? schedule.days.filter((x) => x !== i)
                  : [...schedule.days, i];
                onChange({ days: next });
              }}
            >
              <Text style={[styles.dayText, schedule.days.includes(i) && styles.dayTextSelected]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Time window</Text>
        <View style={styles.timeRow}>
          <View style={styles.timePicker}>
            <TouchableOpacity onPress={() => onChange({ startHour: Math.max(0, schedule.startHour - 1) })}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{schedule.startHour}:00</Text>
            <TouchableOpacity onPress={() => onChange({ startHour: Math.min(schedule.endHour - 1, schedule.startHour + 1) })}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeSep}>–</Text>
          <View style={styles.timePicker}>
            <TouchableOpacity onPress={() => onChange({ endHour: Math.max(schedule.startHour + 1, schedule.endHour - 1) })}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{schedule.endHour}:00</Text>
            <TouchableOpacity onPress={() => onChange({ endHour: Math.min(23, schedule.endHour + 1) })}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.topicsToggle}
          onPress={() => setShowTopics(!showTopics)}
        >
          <Text style={styles.sectionLabel}>Topics ({schedule.topicIds.length} selected)</Text>
          <Text style={styles.arrow}>{showTopics ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showTopics && (
          <TopicGrid
            selected={schedule.topicIds}
            onToggle={(id) => {
              const next = schedule.topicIds.includes(id)
                ? schedule.topicIds.filter((t) => t !== id)
                : [...schedule.topicIds, id];
              onChange({ topicIds: next });
            }}
            compact
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  section: { gap: 10 },
  sectionLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  daysRow: { flexDirection: 'row', gap: 6 },
  dayPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayPillSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  dayTextSelected: { color: '#fff' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, minWidth: 44, textAlign: 'center' },
  timeSep: { fontSize: 18, color: colors.textMuted },
  arrow: { fontSize: 18, color: colors.accent, fontWeight: '700', paddingHorizontal: 2 },
  topicsToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
