import { useEffect, useRef, useCallback } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useSchedule } from './useSchedule';
import { getVideoFeed, getTextFeed } from '../services/contentService';
import { config } from '../constants/config';

export function useFeed() {
  const setVideoFeed = useFeedStore((s) => s.setVideoFeed);
  const setTextFeed = useFeedStore((s) => s.setTextFeed);
  const videoFeed = useFeedStore((s) => s.videoFeed);
  const textFeed = useFeedStore((s) => s.textFeed);
  const signalsSinceLastRank = useFeedStore((s) => s.signalsSinceLastRank);
  const resetSignalCount = useFeedStore((s) => s.resetSignalCount);

  const activeSchedule = useSchedule();

  const rerank = useCallback(() => {
    const prefs = usePreferencesStore.getState();
    const { feedbackHistory, seenContentIds } = useFeedStore.getState();
    const preferences = {
      followedTopicIds: prefs.followedTopicIds,
      followedCreatorIds: prefs.followedCreatorIds,
      blockedKeywords: prefs.blockedKeywords,
      boostedKeywords: prefs.boostedKeywords,
      blockedCreatorIds: prefs.blockedCreatorIds,
      blockedTopicIds: prefs.blockedTopicIds,
      schedules: prefs.schedules,
    };
    const videos = getVideoFeed(preferences, feedbackHistory, activeSchedule, seenContentIds);
    const posts = getTextFeed(preferences, feedbackHistory, activeSchedule, seenContentIds);
    setVideoFeed(videos.slice(0, config.MAX_FEED_ITEMS) as any);
    setTextFeed(posts.slice(0, config.MAX_FEED_ITEMS) as any);
    resetSignalCount();
  }, [activeSchedule, setVideoFeed, setTextFeed, resetSignalCount]);

  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      rerank();
    }
  }, [rerank]);

  useEffect(() => {
    if (signalsSinceLastRank >= config.RERANK_AFTER_SIGNALS) {
      rerank();
    }
  }, [signalsSinceLastRank, rerank]);

  return { videoFeed, textFeed, rerank };
}
