import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { colors } from '../../constants/colors';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { ScheduleMode } from '../../types/preferences';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { ScheduleQuickSetup } from '../../components/onboarding/ScheduleQuickSetup';
import { EmptyState } from '../../components/ui/EmptyState';

const DAY_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function newSchedule(): ScheduleMode {
  return {
    id: Date.now().toString(),
    name: 'New mode',
    topicIds: [],
    days: [1, 2, 3, 4, 5],
    startHour: 7,
    endHour: 9,
    enabled: true,
  };
}

export default function SchedulePreferences() {
  const schedules = usePreferencesStore((s) => s.schedules);
  const addSchedule = usePreferencesStore((s) => s.addSchedule);
  const updateSchedule = usePreferencesStore((s) => s.updateSchedule);
  const removeSchedule = usePreferencesStore((s) => s.removeSchedule);
  const toggleSchedule = usePreferencesStore((s) => s.toggleSchedule);

  const [editingSchedule, setEditingSchedule] = useState<ScheduleMode | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMode, setNewMode] = useState<ScheduleMode>(newSchedule());

  const handleSaveNew = () => {
    addSchedule(newMode);
    setIsAdding(false);
    setNewMode(newSchedule());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="⏰"
            title="No scheduled modes"
            subtitle="Add a mode to show specific topics at certain times of day"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setEditingSchedule(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.modeName}>{item.name}</Text>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleSchedule(item.id)}
                trackColor={{ true: colors.accent }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.daysRow}>
              {DAY_ABBREV.map((d, i) => (
                <View
                  key={i}
                  style={[styles.dayChip, item.days.includes(i) && styles.dayChipActive]}
                >
                  <Text style={[styles.dayChipText, item.days.includes(i) && styles.dayChipTextActive]}>
                    {d}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.timeRange}>{item.startHour}:00 – {item.endHour}:00</Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                Alert.alert('Remove mode', `Remove "${item.name}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeSchedule(item.id) },
                ])
              }
            >
              <Text style={styles.deleteBtnText}>Remove</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={() => { setNewMode(newSchedule()); setIsAdding(true); }}>
            <Text style={styles.addBtnText}>+ Add mode</Text>
          </TouchableOpacity>
        }
      />

      {editingSchedule && (
        <BottomSheet
          visible={!!editingSchedule}
          title={`Edit: ${editingSchedule.name}`}
          options={[
            {
              label: 'Save changes',
              icon: '✓',
              onPress: () => {
                updateSchedule(editingSchedule.id, editingSchedule);
                setEditingSchedule(null);
              },
            },
          ]}
          onClose={() => setEditingSchedule(null)}
        />
      )}

      <BottomSheet
        visible={isAdding}
        title="New scheduled mode"
        options={[
          {
            label: 'Save mode',
            icon: '✓',
            onPress: handleSaveNew,
          },
        ]}
        onClose={() => setIsAdding(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 8 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  daysRow: { flexDirection: 'row', gap: 5 },
  dayChip: {
    width: 32,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: { backgroundColor: colors.accent + '33', borderWidth: 1, borderColor: colors.accent },
  dayChipText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  dayChipTextActive: { color: colors.accent },
  timeRange: { fontSize: 14, color: colors.textSecondary },
  deleteBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  deleteBtnText: { fontSize: 13, color: colors.negative },
  addBtn: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addBtnText: { fontSize: 15, fontWeight: '600', color: colors.accent },
});
