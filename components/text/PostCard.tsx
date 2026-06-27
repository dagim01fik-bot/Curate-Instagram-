import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { Post } from '../../types/content';
import { mockCreators } from '../../data/mockCreators';
import { TOPICS } from '../../constants/topics';
import { Badge } from '../ui/Badge';
import { BottomSheet } from '../ui/BottomSheet';
import { timeAgo } from '../../utils/dateUtils';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useFeedStore } from '../../store/useFeedStore';

function seed(id: string, max: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h) % max;
}

interface PostCardProps {
  post: Post;
  onFeedback?: (type: 'like' | 'not_interested') => void;
}

const TYPE_COLORS: Record<Post['type'], string> = {
  news: colors.positive,
  thread: colors.accent,
  opinion: colors.skip,
};

export function PostCard({ post, onFeedback }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [notInterestedVisible, setNotInterestedVisible] = useState(false);
  const creator = mockCreators.find((c) => c.id === post.creatorId);
  const initials = creator?.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ?? '??';
  const topTopic = TOPICS.find((t) => t.id === post.topicIds[0]);
  const blockCreator = usePreferencesStore((s) => s.blockCreator);
  const blockTopic = usePreferencesStore((s) => s.blockTopic);
  const removeFromFeed = useFeedStore((s) => s.removeFromFeed);

  const notInterestedOptions = [
    {
      label: `This topic (${topTopic?.label ?? 'unknown'})`,
      icon: '🏷️',
      onPress: () => {
        if (post.topicIds[0]) blockTopic(post.topicIds[0]);
        removeFromFeed(post.id);
        onFeedback?.('not_interested');
      },
    },
    {
      label: `This creator (@${creator?.handle ?? 'unknown'})`,
      icon: '👤',
      onPress: () => {
        blockCreator(post.creatorId);
        removeFromFeed(post.id);
        onFeedback?.('not_interested');
      },
    },
    {
      label: 'This type of content',
      icon: '🚫',
      onPress: () => {
        removeFromFeed(post.id);
        onFeedback?.('not_interested');
      },
    },
  ];

  const isLong = post.body.length > 200;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{creator?.name ?? 'Unknown'}</Text>
            {creator?.verified && <Text style={styles.verified}>✓</Text>}
          </View>
          <Text style={styles.meta}>
            @{creator?.handle ?? 'unknown'} · {timeAgo(post.publishedAt)}
          </Text>
        </View>
        <Badge
          label={post.type}
          color={TYPE_COLORS[post.type]}
          small
        />
      </View>

      <Text style={styles.body} numberOfLines={expanded ? undefined : 4}>
        {post.body}
      </Text>
      {isLong && !expanded && (
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <Text style={styles.readMore}>Read more</Text>
        </TouchableOpacity>
      )}

      {topTopic && (
        <View style={styles.topicRow}>
          <Badge label={topTopic.label} color={colors.accent} small />
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onFeedback?.('like')}>
          <Text style={styles.actionIcon}>♥</Text>
          <Text style={styles.actionCount}>{seed(post.id, 3000)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{seed(post.id, 500)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🔁</Text>
          <Text style={styles.actionCount}>{seed(post.id, 1000)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setNotInterestedVisible(true)}>
          <Text style={[styles.actionIcon, { color: colors.textMuted }]}>🚫</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        visible={notInterestedVisible}
        title="Why aren't you interested?"
        options={notInterestedOptions}
        onClose={() => setNotInterestedVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  headerInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  verified: { fontSize: 11, color: colors.accent },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  body: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  readMore: { fontSize: 14, color: colors.accent, fontWeight: '500', marginTop: -4 },
  topicRow: { flexDirection: 'row' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionIcon: { fontSize: 16, color: colors.textSecondary },
  actionCount: { fontSize: 13, color: colors.textSecondary },
});
