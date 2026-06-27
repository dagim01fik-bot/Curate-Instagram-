import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { colors } from '../../constants/colors';
import { Video } from '../../types/content';
import { Creator } from '../../types/content';
import { FeedbackBar } from './FeedbackBar';
import { BottomSheet } from '../ui/BottomSheet';
import { Badge } from '../ui/Badge';
import { FeedbackType } from '../../types/feedback';
import { TOPICS } from '../../constants/topics';
import { formatDuration, formatViews } from '../../utils/dateUtils';
import { usePreferencesStore } from '../../store/usePreferencesStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoCardProps {
  video: Video;
  creator: Creator | undefined;
  isActive: boolean;
  onFeedback: (type: FeedbackType) => void;
}

export function VideoCard({ video, creator, isActive, onFeedback }: VideoCardProps) {
  const [notInterestedVisible, setNotInterestedVisible] = useState(false);
  const blockCreator = usePreferencesStore((s) => s.blockCreator);
  const blockTopic = usePreferencesStore((s) => s.blockTopic);

  const player = useVideoPlayer(video.videoUrl, (p) => {
    p.loop = true;
    p.muted = false;
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const loading = status === 'loading';

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  const handleFeedback = (type: FeedbackType) => {
    if (type === 'not_interested') {
      setNotInterestedVisible(true);
    } else {
      onFeedback(type);
    }
  };

  const topTopics = video.topicIds
    .slice(0, 3)
    .map((id) => TOPICS.find((t) => t.id === id)?.label)
    .filter(Boolean) as string[];

  const initials = creator?.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ?? '??';

  const notInterestedOptions = [
    {
      label: `This topic (${topTopics[0] ?? 'unknown'})`,
      icon: '🏷️',
      onPress: () => {
        if (video.topicIds[0]) blockTopic(video.topicIds[0]);
        onFeedback('not_interested');
      },
    },
    {
      label: `This creator (@${creator?.handle ?? 'unknown'})`,
      icon: '👤',
      onPress: () => {
        blockCreator(video.creatorId);
        onFeedback('not_interested');
      },
    },
    {
      label: 'This type of content',
      icon: '🚫',
      onPress: () => {
        onFeedback('not_interested');
      },
    },
  ];

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
        locations={[0.3, 0.6, 1]}
        style={styles.gradient}
      />

      <View style={styles.overlay}>
        <View style={styles.metaContainer}>
          <View style={styles.creatorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.creatorName}>{creator?.name ?? 'Unknown'}</Text>
              <Text style={styles.handle}>@{creator?.handle ?? 'unknown'}</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
          <View style={styles.tagsRow}>
            {topTopics.map((t, i) => (
              <Badge key={i} label={t} color={colors.accent} small />
            ))}
            <Text style={styles.duration}>{formatDuration(video.duration)}</Text>
            <Text style={styles.views}>{formatViews(video.views)} views</Text>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <FeedbackBar
            onFeedback={handleFeedback}
            likeCount={Math.floor(video.views / 100)}
          />
        </View>
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
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.bg,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  metaContainer: {
    flex: 1,
    gap: 8,
    marginRight: 12,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  handle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  duration: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  views: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  feedbackContainer: {
    paddingBottom: 8,
  },
});
