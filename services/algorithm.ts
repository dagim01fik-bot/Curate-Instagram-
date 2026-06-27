import { Video, Post } from '../types/content';
import { UserPreferences, ScheduleMode } from '../types/preferences';
import { FeedbackSignal } from '../types/feedback';

function scoreItem(
  item: Video | Post,
  preferences: UserPreferences,
  feedbackHistory: FeedbackSignal[],
  activeSchedule: ScheduleMode | null
): number {
  let score = 0;

  const activeTopics = activeSchedule?.topicIds ?? preferences.followedTopicIds;
  const topicMatches = item.topicIds.filter((t) => activeTopics.includes(t)).length;
  score += topicMatches * 30;

  if (preferences.followedCreatorIds.includes(item.creatorId)) score += 50;

  const boostedMatch = item.keywords.filter((k) =>
    preferences.boostedKeywords.includes(k)
  ).length;
  score += boostedMatch * 15;

  const relevantFeedback = feedbackHistory.filter(
    (f) =>
      f.creatorId === item.creatorId ||
      f.topicIds.some((t) => item.topicIds.includes(t))
  );
  for (const signal of relevantFeedback) {
    if (signal.type === 'like' || signal.type === 'more_like_this') score += 20;
    if (signal.type === 'dislike' || signal.type === 'not_interested') score -= 60;
    if (signal.type === 'skip') score -= 10;
  }

  if (preferences.blockedCreatorIds.includes(item.creatorId)) return -9999;
  if (item.topicIds.some((t) => preferences.blockedTopicIds.includes(t))) return -9999;
  if (item.keywords.some((k) => preferences.blockedKeywords.includes(k))) return -9999;

  const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / 3600000;
  score += Math.max(0, 10 - ageHours * 0.1);

  return score;
}

export function rankFeed(
  items: (Video | Post)[],
  preferences: UserPreferences,
  feedbackHistory: FeedbackSignal[],
  activeSchedule: ScheduleMode | null
): (Video | Post)[] {
  return items
    .map((item) => ({ item, score: scoreItem(item, preferences, feedbackHistory, activeSchedule) }))
    .filter(({ score }) => score > -9999)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
