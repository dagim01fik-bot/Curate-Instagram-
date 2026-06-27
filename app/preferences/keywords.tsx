import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TextInput, TouchableOpacity,
} from 'react-native';
import { colors } from '../../constants/colors';
import { usePreferencesStore } from '../../store/usePreferencesStore';

function KeywordTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
        <Text style={styles.tagRemove}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function KeywordsPreferences() {
  const boostedKeywords = usePreferencesStore((s) => s.boostedKeywords);
  const blockedKeywords = usePreferencesStore((s) => s.blockedKeywords);
  const addBoostedKeyword = usePreferencesStore((s) => s.addBoostedKeyword);
  const removeBoostedKeyword = usePreferencesStore((s) => s.removeBoostedKeyword);
  const addBlockedKeyword = usePreferencesStore((s) => s.addBlockedKeyword);
  const removeBlockedKeyword = usePreferencesStore((s) => s.removeBlockedKeyword);

  const [boostInput, setBoostInput] = useState('');
  const [blockInput, setBlockInput] = useState('');

  const submitBoost = () => {
    const kw = boostInput.trim().toLowerCase();
    if (kw) { addBoostedKeyword(kw); setBoostInput(''); }
  };

  const submitBlock = () => {
    const kw = blockInput.trim().toLowerCase();
    if (kw) { addBlockedKeyword(kw); setBlockInput(''); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Boosted keywords</Text>
            <Text style={styles.sectionEmoji}>✦</Text>
          </View>
          <Text style={styles.sectionSub}>Content with these keywords ranks higher in your feed.</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add keyword…"
              placeholderTextColor={colors.textMuted}
              value={boostInput}
              onChangeText={setBoostInput}
              onSubmitEditing={submitBoost}
              returnKeyType="done"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addBtn} onPress={submitBoost}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagRow}>
            {boostedKeywords.length === 0 && (
              <Text style={styles.emptyHint}>No boosted keywords yet</Text>
            )}
            {boostedKeywords.map((kw) => (
              <KeywordTag key={kw} label={kw} onRemove={() => removeBoostedKeyword(kw)} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Blocked keywords</Text>
            <Text style={styles.sectionEmoji}>🚫</Text>
          </View>
          <Text style={styles.sectionSub}>Content with these keywords won't appear in your feed.</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add keyword…"
              placeholderTextColor={colors.textMuted}
              value={blockInput}
              onChangeText={setBlockInput}
              onSubmitEditing={submitBlock}
              returnKeyType="done"
              autoCapitalize="none"
            />
            <TouchableOpacity style={[styles.addBtn, styles.blockBtn]} onPress={submitBlock}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagRow}>
            {blockedKeywords.length === 0 && (
              <Text style={styles.emptyHint}>No blocked keywords yet</Text>
            )}
            {blockedKeywords.map((kw) => (
              <KeywordTag key={kw} label={kw} onRemove={() => removeBlockedKeyword(kw)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 20 },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  sectionEmoji: { fontSize: 16 },
  sectionSub: { fontSize: 13, color: colors.textSecondary, marginTop: -6 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addBtn: {
    backgroundColor: colors.positive,
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockBtn: { backgroundColor: colors.negative },
  addBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: { fontSize: 13, color: colors.textPrimary },
  tagRemove: { fontSize: 17, color: colors.textMuted, lineHeight: 18 },
  emptyHint: { fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
});
