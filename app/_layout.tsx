import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useFeedStore } from '../store/useFeedStore';
import { loadFeedbackHistory } from '../services/feedbackService';
import { colors } from '../constants/colors';

export default function RootLayout() {
  const loadPrefs = usePreferencesStore((s) => s.loadFromStorage);
  const setVideoFeed = useFeedStore((s) => s.setVideoFeed);

  useEffect(() => {
    const init = async () => {
      await loadPrefs();
      const history = await loadFeedbackHistory();
      useFeedStore.setState({ feedbackHistory: history });
    };
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/interests" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/schedule" options={{ title: 'Schedule setup', headerBackTitle: '' }} />
        <Stack.Screen name="preferences/index" options={{ title: 'My feed', headerBackTitle: '' }} />
        <Stack.Screen name="preferences/topics" options={{ title: 'Topics', headerBackTitle: '' }} />
        <Stack.Screen name="preferences/creators" options={{ title: 'Creators', headerBackTitle: '' }} />
        <Stack.Screen name="preferences/keywords" options={{ title: 'Keywords', headerBackTitle: '' }} />
        <Stack.Screen name="preferences/schedule" options={{ title: 'Scheduled modes', headerBackTitle: '' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
