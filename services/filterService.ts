import { Video } from '../types/content';
import { UserPreferences } from '../types/preferences';
import { FeedbackSignal } from '../types/feedback';

/**
 * Apply user content filters to a list of videos.
 * Removes blocked creators, blocked topics, blocked keywords.
 * Boosts followed creators and boosted keywords.
 * Sorts by relevance score.
 */
export function applyContentFilter(
  videos: Video[],
  preferences: UserPreferences,
  feedbackHistory: FeedbackSignal[]
): Video[] {
  return videos
    .map((video) => ({ video, score: scoreVideo(video, preferences, feedbackHistory) }))
    .filter(({ score }) => score > -9999)
    .sort((a, b) => b.score - a.score)
    .map(({ video }) => video);
}

function scoreVideo(
  video: Video,
  prefs: UserPreferences,
  history: FeedbackSignal[]
): number {
  if (prefs.blockedCreatorIds?.includes(video.creatorId)) return -9999;
  if (video.topicIds.some((t) => prefs.blockedTopicIds?.includes(t))) return -9999;
  if (video.keywords.some((k) => prefs.blockedKeywords?.includes(k))) return -9999;

  let score = 0;

  const topicMatches = video.topicIds.filter((t) =>
    prefs.followedTopicIds?.includes(t)
  ).length;
  score += topicMatches * 30;

  if (prefs.followedCreatorIds?.includes(video.creatorId)) score += 50;

  const boostedMatches = video.keywords.filter((k) =>
    prefs.boostedKeywords?.includes(k)
  ).length;
  score += boostedMatches * 15;

  const relevant = history.filter(
    (f) =>
      f.creatorId === video.creatorId ||
      f.topicIds.some((t) => video.topicIds.includes(t))
  );
  for (const signal of relevant) {
    if (signal.type === 'like' || signal.type === 'more_like_this') score += 20;
    if (signal.type === 'dislike' || signal.type === 'not_interested') score -= 60;
    if (signal.type === 'skip') score -= 10;
  }

  const ageHours =
    (Date.now() - new Date(video.publishedAt).getTime()) / 3_600_000;
  score += Math.max(0, 10 - ageHours * 0.1);

  if (video.source === 'youtube') score += 5;

  return score;
}
