import { FeedbackSignal } from '../types/feedback';
import { UserPreferences } from '../types/preferences';

export function computeInfluenceBreakdown(
  preferences: UserPreferences,
  feedbackHistory: FeedbackSignal[]
): { topics: number; creators: number; history: number; schedule: number } {
  const topicWeight = preferences.followedTopicIds.length * 30;
  const creatorWeight = preferences.followedCreatorIds.length * 50;
  const historyWeight = Math.min(feedbackHistory.length * 5, 200);
  const scheduleWeight = preferences.schedules.filter((s) => s.enabled).length * 40;

  const total = topicWeight + creatorWeight + historyWeight + scheduleWeight;
  if (total === 0) return { topics: 25, creators: 25, history: 25, schedule: 25 };

  return {
    topics: Math.round((topicWeight / total) * 100),
    creators: Math.round((creatorWeight / total) * 100),
    history: Math.round((historyWeight / total) * 100),
    schedule: Math.round((scheduleWeight / total) * 100),
  };
}
