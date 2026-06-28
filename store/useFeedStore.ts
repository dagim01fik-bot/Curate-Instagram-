import { create } from 'zustand';
import { Video, Post } from '../types/content';
import { FeedbackSignal } from '../types/feedback';

interface FeedStore {
  videoFeed: Video[];
  textFeed: Post[];
  feedbackHistory: FeedbackSignal[];
  signalsSinceLastRank: number;
  seenContentIds: Set<string>;
  setVideoFeed: (items: Video[]) => void;
  setTextFeed: (items: Post[]) => void;
  removeFromFeed: (id: string) => void;
  markSeen: (id: string) => void;
  addFeedback: (signal: FeedbackSignal) => void;
  resetFeedbackHistory: () => void;
  incrementSignals: () => void;
  resetSignalCount: () => void;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  videoFeed: [],
  textFeed: [],
  feedbackHistory: [],
  signalsSinceLastRank: 0,
  seenContentIds: new Set(),

  setVideoFeed: (items) => set({ videoFeed: items }),
  setTextFeed: (items) => set({ textFeed: items }),

  removeFromFeed: (id) =>
    set((s) => ({
      videoFeed: s.videoFeed.filter((v) => v.id !== id),
      textFeed: s.textFeed.filter((p) => p.id !== id),
      seenContentIds: new Set([...s.seenContentIds, id]),
    })),

  markSeen: (id) =>
    set((s) => ({
      seenContentIds: new Set([...s.seenContentIds, id]),
    })),

  addFeedback: (signal) =>
    set((s) => {
      const history = [...s.feedbackHistory, signal].slice(-500);
      return { feedbackHistory: history, signalsSinceLastRank: s.signalsSinceLastRank + 1 };
    }),

  resetFeedbackHistory: () => set({ feedbackHistory: [] }),

  incrementSignals: () => set((s) => ({ signalsSinceLastRank: s.signalsSinceLastRank + 1 })),

  resetSignalCount: () => set({ signalsSinceLastRank: 0 }),
}));
