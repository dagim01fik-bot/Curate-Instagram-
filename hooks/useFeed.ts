import { useEffect, useCallback, useState } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useSchedule } from './useSchedule';
import { fetchVideosByTopics } from '../services/contentService';
import { applyContentFilter } from '../services/filterService';
import { mockPosts } from '../data/mockPosts';
import { rankFeed } from '../services/algorithm';
import { config } from '../constants/config';

export function useFeed() {
  const setVideoFeed = useFeedStore((s) => s.setVideoFeed);
  const setTextFeed = useFeedStore((s) => s.setTextFeed);
  const videoFeed = useFeedStore((s) => s.videoFeed);
  const textFeed = useFeedStore((s) => s.textFeed);
  const signalsSinceLastRank = useFeedStore((s) => s.signalsSinceLastRank);
  const resetSignalCount = useFeedStore((s) => s.resetSignalCount);
  const [loading, setLoading] = useState(false);

  // Reactive subscriptions so the feed re-fetches when these change.
  const followedTopicIds = usePreferencesStore((s) => s.followedTopicIds);
  const isHydrated = usePreferencesStore((s) => s.isHydrated);

  const activeSchedule = useSchedule();

  const rerank = useCallback(async () => {
    setLoading(true);
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

    const activeTopics =
      activeSchedule?.topicIds?.length
        ? activeSchedule.topicIds
        : preferences.followedTopicIds ?? [];

    try {
      if (activeTopics.length > 0) {
        const rawVideos = await fetchVideosByTopics(activeTopics, 8);
        const filteredVideos = applyContentFilter(rawVideos, preferences, feedbackHistory);
        const unseenVideos = filteredVideos.filter((v) => !seenContentIds.has(v.id));
        setVideoFeed(unseenVideos.slice(0, config.MAX_FEED_ITEMS) as any);
      } else {
        setVideoFeed([]);
      }

      const posts = rankFeed(
        mockPosts.filter((p) => !seenContentIds.has(p.id)),
        preferences,
        feedbackHistory,
        activeSchedule
      );
      setTextFeed(posts.slice(0, config.MAX_FEED_ITEMS) as any);
    } catch (err) {
      console.error('Feed load error:', err);
    } finally {
      setLoading(false);
      resetSignalCount();
    }
  }, [activeSchedule, followedTopicIds, setVideoFeed, setTextFeed, resetSignalCount]);

  // Re-fetch once preferences are hydrated from storage, and whenever the
  // active schedule or followed topics change.
  useEffect(() => {
    if (!isHydrated) return;
    rerank();
  }, [isHydrated, rerank]);

  useEffect(() => {
    if (signalsSinceLastRank >= config.RERANK_AFTER_SIGNALS) {
      rerank();
    }
  }, [signalsSinceLastRank, rerank]);

  return { videoFeed, textFeed, rerank, loading };
}
