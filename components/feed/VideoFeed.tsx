import React, { useRef, useState, useCallback } from 'react';
import { FlatList, Dimensions, ViewToken, View } from 'react-native';
import { Video } from '../../types/content';
import { VideoCard } from './VideoCard';
import { ScheduleBanner } from './ScheduleBanner';
import { EmptyState } from '../ui/EmptyState';
import { FeedbackType } from '../../types/feedback';
import { mockCreators } from '../../data/mockCreators';
import { ScheduleMode } from '../../types/preferences';
import { useFeedStore } from '../../store/useFeedStore';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoFeedProps {
  videos: Video[];
  activeSchedule: ScheduleMode | null;
  onFeedback: (video: Video, type: FeedbackType) => void;
}

export function VideoFeed({ videos, activeSchedule, onFeedback }: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Video>>(null);
  const markSeen = useFeedStore((s) => s.markSeen);
  const router = useRouter();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const idx = viewableItems[0].index;
        setActiveIndex(idx);
        const item = viewableItems[0].item as Video | undefined;
        if (item) markSeen(item.id);
      }
    },
    [markSeen]
  );

  const scrollToNext = useCallback(
    (index: number) => {
      const next = index + 1;
      if (next < videos.length) {
        listRef.current?.scrollToIndex({ index: next, animated: true });
      }
    },
    [videos.length]
  );

  if (videos.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
        <EmptyState
          icon="🎬"
          title="You've seen everything for now"
          subtitle="Adjust your topics to see more content"
          actionLabel="Edit topics"
          onAction={() => router.push('/preferences/topics')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {activeSchedule && (
        <View style={{ position: 'absolute', top: 52, left: 0, right: 0, zIndex: 10, alignItems: 'center' }}>
          <ScheduleBanner schedule={activeSchedule} />
        </View>
      )}
      <FlatList
        ref={listRef}
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const creator = mockCreators.find((c) => c.id === item.creatorId);
          return (
            <VideoCard
              video={item}
              creator={creator}
              isActive={index === activeIndex}
              onFeedback={(type) => {
                if (type === 'skip') scrollToNext(index);
                onFeedback(item, type);
              }}
            />
          );
        }}
        onScrollToIndexFailed={({ index }) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index, animated: true });
          }, 300);
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}
