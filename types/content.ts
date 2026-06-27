export interface Video {
  id: string;
  title: string;
  creatorId: string;
  topicIds: string[];
  keywords: string[];
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  publishedAt: string;
  sourceApp: 'youtube' | 'tiktok' | 'curate';
}

export interface Post {
  id: string;
  creatorId: string;
  topicIds: string[];
  keywords: string[];
  body: string;
  linkUrl?: string;
  linkPreviewTitle?: string;
  imageUrl?: string;
  publishedAt: string;
  type: 'news' | 'thread' | 'opinion';
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  topicIds: string[];
  bio: string;
  followerCount: number;
  verified: boolean;
}
