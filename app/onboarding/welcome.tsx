import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.bg, '#0F0F1A', colors.bg]}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>✦</Text>
          </View>
          <Text style={styles.wordmark}>Curate.</Text>
          <Text style={styles.tagline}>The feed you actually want.</Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: '🎯', text: 'You control what you see' },
            { icon: '🚫', text: 'Block topics, creators, keywords' },
            { icon: '⏰', text: 'Schedule modes for different times' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <Button
          label="Get started"
          onPress={() => router.push('/onboarding/interests')}
          style={styles.cta}
        />
        <Text style={styles.footnote}>No sign-up needed to explore</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 48,
  },
  logoSection: {
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 32,
    color: '#fff',
  },
  wordmark: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 17,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  features: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  featureIcon: { fontSize: 20 },
  featureText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  cta: {
    marginTop: 8,
  },
  footnote: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -32,
  },
});
