import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { colors } from '../constants/colors';

export default function RootIndex() {
  const isHydrated = usePreferencesStore((s) => s.isHydrated);
  const followedTopicIds = usePreferencesStore((s) => s.followedTopicIds);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (followedTopicIds.length === 0) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
