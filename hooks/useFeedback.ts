import { useCallback } from 'react';
import { FeedbackSignal, FeedbackType } from '../types/feedback';
import { Video, Post } from '../types/content';
import { useFeedStore } from '../store/useFeedStore';
import { processFeedback } from '../services/feedbackService';

export function useFeedback() {
  const removeFromFeed = useFeedStore((s) => s.removeFromFeed);
  const signalsSinceLastRank = useFeedStore((s) => s.signalsSinceLastRank);
  const resetSignalCount = useFeedStore((s) => s.resetSignalCount);

  const sendFeedback = useCallback(
    async (
      item: Video | Post,
      type: FeedbackType,
      contentType: 'video' | 'post'
    ) => {
      const signal: FeedbackSignal = {
        contentId: item.id,
        contentType,
        type,
        topicIds: item.topicIds,
        creatorId: item.creatorId,
        keywords: item.keywords,
        timestamp: new Date().toISOString(),
      };

      await processFeedback(signal);

      if (type === 'dislike' || type === 'not_interested') {
        removeFromFeed(item.id);
      }
    },
    [removeFromFeed]
  );

  const shouldRerank = signalsSinceLastRank >= 3;

  return { sendFeedback, shouldRerank, resetSignalCount };
}
