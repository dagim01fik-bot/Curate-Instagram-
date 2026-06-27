export type FeedbackType = 'like' | 'dislike' | 'skip' | 'more_like_this' | 'not_interested';

export interface FeedbackSignal {
  contentId: string;
  contentType: 'video' | 'post';
  type: FeedbackType;
  topicIds: string[];
  creatorId: string;
  keywords: string[];
  timestamp: string;
}
