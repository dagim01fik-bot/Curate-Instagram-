import { Video, Post } from '../types/content';
import { mockVideos } from '../data/mockVideos';
import { mockPosts } from '../data/mockPosts';
import { rankFeed } from './algorithm';
import { UserPreferences, ScheduleMode } from '../types/preferences';
import { FeedbackSignal } from '../types/feedback';

export function getVideoFeed(
  preferences: UserPreferences,
  feedbackHistory: FeedbackSignal[],
  activeSchedule: ScheduleMode | null,
  excludeIds: Set<string> = new Set()
): Video[] {
  const available = mockVideos.filter((v) => !excludeIds.has(v.id));
  return rankFeed(available, preferences, feedbackHistory, activeSchedule) as Video[];
}

export function getTextFeed(
  preferences: UserPreferences,
  feedbackHistory: FeedbackSignal[],
  activeSchedule: ScheduleMode | null,
  excludeIds: Set<string> = new Set()
): Post[] {
  const available = mockPosts.filter((p) => !excludeIds.has(p.id));
  return rankFeed(available, preferences, feedbackHistory, activeSchedule) as Post[];
}
