import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import { useSchedule } from '../../hooks/useSchedule';
import { useFeedback } from '../../hooks/useFeedback';
import { VideoFeed } from '../../components/feed/VideoFeed';
import { Video } from '../../types/content';
import { FeedbackType } from '../../types/feedback';
import { useFeedStore } from '../../store/useFeedStore';
import { colors } from '../../constants/colors';

export default function VideoFeedTab() {
  const { videoFeed, rerank } = useFeed();
  const activeSchedule = useSchedule();
  const { sendFeedback, shouldRerank, resetSignalCount } = useFeedback();
  const removeFromFeed = useFeedStore((s) => s.removeFromFeed);

  useEffect(() => {
    if (shouldRerank) {
      rerank();
      resetSignalCount();
    }
  }, [shouldRerank]);

  const handleFeedback = async (video: Video, type: FeedbackType) => {
    await sendFeedback(video, type, 'video');
    if (type === 'not_interested' || type === 'dislike') {
      removeFromFeed(video.id);
    }
    if (type === 'more_like_this') {
      rerank();
    }
  };

  return (
    <View style={styles.container}>
      <VideoFeed
        videos={videoFeed}
        activeSchedule={activeSchedule}
        onFeedback={handleFeedback}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
