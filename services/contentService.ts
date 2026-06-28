import { Video } from '../types/content';
import { TOPIC_API_MAP } from '../constants/topics';

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';
const PEXELS_BASE = 'https://api.pexels.com/videos';

// ─── YouTube ────────────────────────────────────────────────────────────────

async function fetchYouTubeShorts(
  topicId: string,
  maxResults = 10
): Promise<Video[]> {
  const topicMap = TOPIC_API_MAP[topicId];
  if (!topicMap || !YOUTUBE_API_KEY) return [];

  try {
    const query = encodeURIComponent(
      (topicMap.youtubeQuery ?? topicId) + ' #shorts'
    );
    const categoryParam = topicMap.youtubeCategoryId
      ? `&videoCategoryId=${topicMap.youtubeCategoryId}` 
      : '';

    const searchUrl =
      `${YOUTUBE_BASE}/search?part=snippet` +
      `&q=${query}` +
      `&type=video` +
      `&videoDuration=short` +
      `&videoEmbeddable=true` +
      `&maxResults=${maxResults}` +
      categoryParam +
      `&key=${YOUTUBE_API_KEY}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      console.warn(`YouTube search failed for topic "${topicId}":`, searchRes.status);
      return [];
    }

    const searchData = await searchRes.json();
    const items = searchData.items ?? [];
    if (items.length === 0) return [];

    const videoIds = items.map((i: any) => i.id.videoId).join(',');
    const detailUrl =
      `${YOUTUBE_BASE}/videos?part=snippet,contentDetails,statistics` +
      `&id=${videoIds}` +
      `&key=${YOUTUBE_API_KEY}`;

    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) return [];
    const detailData = await detailRes.json();

    return (detailData.items ?? []).map((v: any): Video => ({
      id: `yt_${v.id}`,
      title: v.snippet.title,
      creatorId: v.snippet.channelId,
      creatorName: v.snippet.channelTitle,
      topicIds: [topicId],
      keywords: v.snippet.tags ?? [],
      thumbnailUrl: v.snippet.thumbnails?.high?.url ?? '',
      videoUrl: `https://www.youtube.com/shorts/${v.id}`,
      embedUrl: `https://www.youtube.com/embed/${v.id}?autoplay=1&mute=0&playsinline=1`,
      duration: parseISO8601Duration(v.contentDetails?.duration ?? 'PT0S'),
      views: parseInt(v.statistics?.viewCount ?? '0', 10),
      publishedAt: v.snippet.publishedAt,
      source: 'youtube' as const,
    }));
  } catch (err) {
    console.warn(`YouTube fetch error for topic "${topicId}":`, err);
    return [];
  }
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] ?? '0', 10);
  const m = parseInt(match[2] ?? '0', 10);
  const s = parseInt(match[3] ?? '0', 10);
  return h * 3600 + m * 60 + s;
}

// ─── Pexels ─────────────────────────────────────────────────────────────────

async function fetchPexelsVideos(
  topicId: string,
  perPage = 10
): Promise<Video[]> {
  const topicMap = TOPIC_API_MAP[topicId];
  if (!topicMap || !PEXELS_API_KEY) return [];

  try {
    const query = encodeURIComponent(topicMap.pexelsQuery);
    const url =
      `${PEXELS_BASE}/search?query=${query}` +
      `&per_page=${perPage}` +
      `&orientation=portrait`;

    const res = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY },
    });

    if (!res.ok) {
      console.warn(`Pexels fetch failed for topic "${topicId}":`, res.status);
      return [];
    }

    const data = await res.json();
    return (data.videos ?? []).map((v: any): Video => {
      const file =
        v.video_files.find((f: any) => f.quality === 'hd' && f.width <= 1080) ??
        v.video_files[0];

      return {
        id: `px_${v.id}`,
        title: v.url.split('/').filter(Boolean).pop() ?? `${topicId} video`,
        creatorId: `pexels_${v.user.id}`,
        creatorName: v.user.name,
        topicIds: [topicId],
        keywords: [topicMap.pexelsQuery],
        thumbnailUrl: v.image,
        videoUrl: file?.link ?? '',
        embedUrl: null,
        duration: v.duration,
        views: 0,
        publishedAt: new Date().toISOString(),
        source: 'pexels' as const,
      };
    });
  } catch (err) {
    console.warn(`Pexels fetch error for topic "${topicId}":`, err);
    return [];
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function fetchVideosByTopics(
  topicIds: string[],
  maxPerTopic = 8
): Promise<Video[]> {
  if (!topicIds || topicIds.length === 0) return [];

  const allFetches = topicIds.flatMap((topicId) => [
    fetchYouTubeShorts(topicId, maxPerTopic),
    fetchPexelsVideos(topicId, Math.ceil(maxPerTopic / 2)),
  ]);

  const results = await Promise.allSettled(allFetches);

  const videos: Video[] = [];
  const seenIds = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const video of result.value) {
        if (!seenIds.has(video.id)) {
          seenIds.add(video.id);
          videos.push(video);
        }
      }
    }
  }

  return shuffle(videos);
}

// Fisher–Yates shuffle so the feed order varies between reloads and feels fresh.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
