import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { Creator } from '../../types/content';
import { formatFollowers } from '../../utils/dateUtils';
import { TOPICS } from '../../constants/topics';

interface CreatorCardProps {
  creator: Creator;
  isFollowed: boolean;
  isBlocked?: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
}

export function CreatorCard({ creator, isFollowed, isBlocked, onFollow, onUnfollow, onBlock, onUnblock }: CreatorCardProps) {
  const initials = creator.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const topTopics = creator.topicIds
    .slice(0, 2)
    .map((id) => TOPICS.find((t) => t.id === id)?.label)
    .filter(Boolean);

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{creator.name}</Text>
          {creator.verified && <Text style={styles.verified}>✓</Text>}
        </View>
        <Text style={styles.handle}>@{creator.handle}</Text>
        <Text style={styles.bio} numberOfLines={2}>{creator.bio}</Text>
        <View style={styles.meta}>
          <Text style={styles.followers}>{formatFollowers(creator.followerCount)} followers</Text>
          {topTopics.map((t, i) => (
            <View key={i} style={styles.topicTag}>
              <Text style={styles.topicText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        {isBlocked ? (
          <TouchableOpacity style={[styles.btn, styles.unblockBtn]} onPress={onUnblock}>
            <Text style={styles.unblockText}>Unblock</Text>
          </TouchableOpacity>
        ) : isFollowed ? (
          <TouchableOpacity style={[styles.btn, styles.followingBtn]} onPress={onUnfollow}>
            <Text style={styles.followingText}>Following</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.followBtn]} onPress={onFollow}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  verified: { color: colors.accent, fontSize: 12 },
  handle: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  bio: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 17 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  followers: { fontSize: 11, color: colors.textMuted },
  topicTag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topicText: { fontSize: 10, color: colors.accent },
  actions: { justifyContent: 'center', paddingTop: 4 },
  btn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  followBtn: { backgroundColor: colors.accent },
  followText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  followingBtn: { backgroundColor: colors.surfaceHigh, borderWidth: 1, borderColor: colors.border },
  followingText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  unblockBtn: { backgroundColor: colors.surfaceHigh, borderWidth: 1, borderColor: colors.negative },
  unblockText: { fontSize: 13, fontWeight: '600', color: colors.negative },
});
