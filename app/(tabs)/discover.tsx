import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';
import { mockCreators } from '../../data/mockCreators';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { CreatorCard } from '../../components/preferences/CreatorCard';
import { TOPICS } from '../../constants/topics';

export default function DiscoverTab() {
  const followedTopicIds = usePreferencesStore((s) => s.followedTopicIds);
  const followedCreatorIds = usePreferencesStore((s) => s.followedCreatorIds);
  const blockedCreatorIds = usePreferencesStore((s) => s.blockedCreatorIds);
  const followCreator = usePreferencesStore((s) => s.followCreator);
  const unfollowCreator = usePreferencesStore((s) => s.unfollowCreator);
  const blockCreator = usePreferencesStore((s) => s.blockCreator);
  const unblockCreator = usePreferencesStore((s) => s.unblockCreator);

  const topTopic = followedTopicIds[0];
  const topTopicLabel = TOPICS.find((t) => t.id === topTopic)?.label ?? 'your interests';

  const ranked = [...mockCreators]
    .filter((c) => !blockedCreatorIds.includes(c.id))
    .sort((a, b) => {
      const aMatch = a.topicIds.filter((t) => followedTopicIds.includes(t)).length;
      const bMatch = b.topicIds.filter((t) => followedTopicIds.includes(t)).length;
      return bMatch - aMatch;
    })
    .slice(0, 12);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={ranked}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Discover creators</Text>
            <Text style={styles.subheading}>Based on your interest in {topTopicLabel}</Text>
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
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    gap: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
