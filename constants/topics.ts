export interface TopicDef {
  id: string;
  label: string;
  icon: string;
}

export const TOPICS: TopicDef[] = [
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'vibe-coding', label: 'Vibe Coding', icon: '🎵' },
  { id: 'coding', label: 'Coding', icon: '</>' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'comedy', label: 'Comedy & Memes', icon: '😂' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'finance', label: 'Finance', icon: '📈' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'viral', label: 'Viral Videos', icon: '🔥' },
];

export const TOPIC_API_MAP: Record<string, {
  youtubeCategoryId?: string;
  youtubeQuery?: string;
  pexelsQuery: string;
}> = {
  'tech': {
    youtubeCategoryId: '28',
    youtubeQuery: 'technology news 2025',
    pexelsQuery: 'technology',
  },
  'ai': {
    youtubeQuery: 'artificial intelligence AI tutorial',
    pexelsQuery: 'artificial intelligence',
  },
  'coding': {
    youtubeQuery: 'programming coding tutorial',
    pexelsQuery: 'coding programming',
  },
  'vibe-coding': {
    youtubeQuery: 'vibe coding AI development windsurf cursor',
    pexelsQuery: 'software development',
  },
  'comedy': {
    youtubeCategoryId: '23',
    youtubeQuery: 'funny comedy shorts',
    pexelsQuery: 'funny people laughing',
  },
  'news': {
    youtubeCategoryId: '25',
    youtubeQuery: 'latest news today',
    pexelsQuery: 'news broadcast',
  },
  'fitness': {
    youtubeCategoryId: '17',
    youtubeQuery: 'fitness workout exercise',
    pexelsQuery: 'fitness workout',
  },
  'gaming': {
    youtubeCategoryId: '20',
    youtubeQuery: 'gaming highlights gameplay',
    pexelsQuery: 'gaming esports',
  },
  'design': {
    youtubeQuery: 'UI UX design tutorial',
    pexelsQuery: 'graphic design creative',
  },
  'music': {
    youtubeCategoryId: '10',
    youtubeQuery: 'music video new',
    pexelsQuery: 'music concert',
  },
  'science': {
    youtubeCategoryId: '28',
    youtubeQuery: 'science discovery explained',
    pexelsQuery: 'science laboratory',
  },
  'finance': {
    youtubeQuery: 'personal finance investing money',
    pexelsQuery: 'finance money business',
  },
  'cooking': {
    youtubeQuery: 'cooking recipe food',
    pexelsQuery: 'cooking food kitchen',
  },
  'travel': {
    youtubeCategoryId: '19',
    youtubeQuery: 'travel vlog destination',
    pexelsQuery: 'travel adventure nature',
  },
  'sports': {
    youtubeCategoryId: '17',
    youtubeQuery: 'sports highlights',
    pexelsQuery: 'sports athletic',
  },
  'viral': {
    youtubeQuery: 'viral video trending shorts',
    pexelsQuery: 'viral trending',
  },
};
