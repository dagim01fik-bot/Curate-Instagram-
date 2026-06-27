import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { mockCreators } from '../../data/mockCreators';
import { CreatorCard } from '../../components/preferences/CreatorCard';
import { EmptyState } from '../../components/ui/EmptyState';

export default function CreatorsPreferences() {
  const router = useRouter();
  const followedCreatorIds = usePreferencesStore((s) => s.followedCreatorIds);
  const blockedCreatorIds = usePreferencesStore((s) => s.blockedCreatorIds);
  const unfollowCreator = usePreferencesStore((s) => s.unfollowCreator);
  const blockCreator = usePreferencesStore((s) => s.blockCreator);
  const unblockCreator = usePreferencesStore((s) => s.unblockCreator);
  const followCreator = usePreferencesStore((s) => s.followCreator);

  const followed = mockCreators.filter((c) => followedCreatorIds.includes(c.id));
  const blocked = mockCreators.filter((c) => blockedCreatorIds.includes(c.id));

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={[...followed, ...blocked]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {followed.length === 0 && blocked.length === 0 && (
              <EmptyState
                icon="👥"
                title="No creators yet"
                subtitle="Follow creators from the Discover tab to shape your feed"
              />
            )}
            {followed.length > 0 && (
              <Text style={styles.sectionTitle}>Following ({followed.length})</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <CreatorCard
            creator={item}
            isFollowed={followedCreatorIds.includes(item.id)}
            isBlocked={blockedCreatorIds.includes(item.id)}
            onFollow={() => followCreator(item.id)}
            onUnfollow={() => unfollowCreator(item.id)}
            onBlock={() => blockCreator(item.id)}
            onUnblock={() => unblockCreator(item.id)}
          />
        )}
        ListFooterComponent={
          blocked.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.sectionTitle}>Blocked ({blocked.length})</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.discoverBtn}
        onPress={() => router.replace('/(tabs)/discover')}
      >
        <Text style={styles.discoverText}>Find creators in Discover</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  footer: { paddingTop: 16 },
  discoverBtn: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  discoverText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
