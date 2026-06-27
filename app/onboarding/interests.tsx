import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { TopicGrid } from '../../components/onboarding/TopicGrid';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { config } from '../../constants/config';

export default function InterestsScreen() {
  const router = useRouter();
  const savedTopics = usePreferencesStore((s) => s.followedTopicIds);
  const setFollowedTopics = usePreferencesStore((s) => s.setFollowedTopics);
  const [selected, setSelected] = useState<string[]>(savedTopics);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const canContinue = selected.length >= config.MIN_TOPICS_REQUIRED;

  const handleContinue = () => {
    setFollowedTopics(selected);
    router.push('/onboarding/schedule');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>Curate.</Text>
          <Text style={styles.tagline}>The feed you actually want.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>What do you want to see?</Text>
          <Text style={styles.subtitle}>
            Pick at least {config.MIN_TOPICS_REQUIRED} topics. You can change or remove these anytime.
          </Text>
        </View>

        <TopicGrid selected={selected} onToggle={toggle} />

        <View style={styles.footer}>
          <Text style={[styles.countLabel, canContinue && styles.countLabelReady]}>
            {selected.length} selected · minimum {config.MIN_TOPICS_REQUIRED}
          </Text>
          <Button
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 24,
  },
  header: { gap: 4 },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: { gap: 6 },
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
  footer: {
    gap: 12,
    marginTop: 8,
  },
  countLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  countLabelReady: {
    color: colors.accent,
  },
  btn: {
    width: '100%',
  },
});
