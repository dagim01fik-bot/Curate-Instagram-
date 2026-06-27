import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { Post } from '../../types/content';
import { PostCard } from './PostCard';
import { EmptyState } from '../ui/EmptyState';
import { useRouter } from 'expo-router';

type FilterTab = 'all' | 'news' | 'thread' | 'opinion';

interface TextFeedProps {
  posts: Post[];
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'news', label: 'News' },
  { key: 'thread', label: 'Threads' },
  { key: 'opinion', label: 'Opinion' },
];

export function TextFeed({ posts }: TextFeedProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const router = useRouter();

  const filtered = activeTab === 'all' ? posts : posts.filter((p) => p.type === activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Nothing here yet"
          subtitle="Adjust your topics to see more posts"
          actionLabel="Edit topics"
          onAction={() => router.push('/preferences/topics')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 4,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surfaceHigh,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
