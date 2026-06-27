import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { TopicGrid } from '../../components/onboarding/TopicGrid';
import { TopicPill } from '../../components/preferences/TopicPill';
import { TOPICS } from '../../constants/topics';

export default function TopicsPreferences() {
  const followedTopicIds = usePreferencesStore((s) => s.followedTopicIds);
  const blockedTopicIds = usePreferencesStore((s) => s.blockedTopicIds);
  const toggleTopic = usePreferencesStore((s) => s.toggleTopic);
  const unblockTopic = usePreferencesStore((s) => s.unblockTopic);

  const [selected, setSelected] = useState<string[]>(followedTopicIds);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      toggleTopic(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Followed topics</Text>
        <Text style={styles.sectionSub}>These topics shape your feed. Changes apply immediately.</Text>
        <TopicGrid selected={selected} onToggle={toggle} />

        {blockedTopicIds.length > 0 && (
          <View style={styles.blockedSection}>
            <Text style={styles.sectionTitle}>Blocked topics</Text>
            <Text style={styles.sectionSub}>Content with these topics won't appear in your feed.</Text>
            <View style={styles.blockedRow}>
              {blockedTopicIds.map((id) => {
                const topic = TOPICS.find((t) => t.id === id);
                if (!topic) return null;
                return (
                  <TopicPill
                    key={id}
                    label={topic.label}
                    icon="🚫"
                    selected={false}
                    onPress={() => unblockTopic(id)}
                    small
                  />
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  sectionSub: { fontSize: 13, color: colors.textSecondary, marginTop: -8 },
  blockedSection: { gap: 8, marginTop: 8 },
  blockedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
