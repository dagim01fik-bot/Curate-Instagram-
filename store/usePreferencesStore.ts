import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, ScheduleMode } from '../types/preferences';

const STORAGE_KEY = 'userPreferences';

const defaultPreferences: UserPreferences = {
  followedTopicIds: [],
  followedCreatorIds: [],
  blockedKeywords: [],
  boostedKeywords: [],
  blockedCreatorIds: [],
  blockedTopicIds: [],
  schedules: [],
};

interface PreferencesState extends UserPreferences {
  isHydrated: boolean;
  setFollowedTopics: (ids: string[]) => void;
  toggleTopic: (id: string) => void;
  blockTopic: (id: string) => void;
  unblockTopic: (id: string) => void;
  followCreator: (id: string) => void;
  unfollowCreator: (id: string) => void;
  blockCreator: (id: string) => void;
  unblockCreator: (id: string) => void;
  addBoostedKeyword: (keyword: string) => void;
  removeBoostedKeyword: (keyword: string) => void;
  addBlockedKeyword: (keyword: string) => void;
  removeBlockedKeyword: (keyword: string) => void;
  addSchedule: (schedule: ScheduleMode) => void;
  updateSchedule: (id: string, updates: Partial<ScheduleMode>) => void;
  removeSchedule: (id: string) => void;
  toggleSchedule: (id: string) => void;
  loadFromStorage: () => Promise<void>;
  persist: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...defaultPreferences,
  isHydrated: false,

  setFollowedTopics: (ids) => {
    set({ followedTopicIds: ids });
    get().persist();
  },

  toggleTopic: (id) => {
    const current = get().followedTopicIds;
    const updated = current.includes(id)
      ? current.filter((t) => t !== id)
      : [...current, id];
    set({ followedTopicIds: updated });
    get().persist();
  },

  blockTopic: (id) => {
    set((s) => ({ blockedTopicIds: [...new Set([...s.blockedTopicIds, id])] }));
    get().persist();
  },

  unblockTopic: (id) => {
    set((s) => ({ blockedTopicIds: s.blockedTopicIds.filter((t) => t !== id) }));
    get().persist();
  },

  followCreator: (id) => {
    set((s) => ({ followedCreatorIds: [...new Set([...s.followedCreatorIds, id])] }));
    get().persist();
  },

  unfollowCreator: (id) => {
    set((s) => ({ followedCreatorIds: s.followedCreatorIds.filter((c) => c !== id) }));
    get().persist();
  },

  blockCreator: (id) => {
    set((s) => ({
      blockedCreatorIds: [...new Set([...s.blockedCreatorIds, id])],
      followedCreatorIds: s.followedCreatorIds.filter((c) => c !== id),
    }));
    get().persist();
  },

  unblockCreator: (id) => {
    set((s) => ({ blockedCreatorIds: s.blockedCreatorIds.filter((c) => c !== id) }));
    get().persist();
  },

  addBoostedKeyword: (keyword) => {
    set((s) => ({ boostedKeywords: [...new Set([...s.boostedKeywords, keyword.toLowerCase()])] }));
    get().persist();
  },

  removeBoostedKeyword: (keyword) => {
    set((s) => ({ boostedKeywords: s.boostedKeywords.filter((k) => k !== keyword) }));
    get().persist();
  },

  addBlockedKeyword: (keyword) => {
    set((s) => ({ blockedKeywords: [...new Set([...s.blockedKeywords, keyword.toLowerCase()])] }));
    get().persist();
  },

  removeBlockedKeyword: (keyword) => {
    set((s) => ({ blockedKeywords: s.blockedKeywords.filter((k) => k !== keyword) }));
    get().persist();
  },

  addSchedule: (schedule) => {
    set((s) => ({ schedules: [...s.schedules, schedule] }));
    get().persist();
  },

  updateSchedule: (id, updates) => {
    set((s) => ({
      schedules: s.schedules.map((sc) => (sc.id === id ? { ...sc, ...updates } : sc)),
    }));
    get().persist();
  },

  removeSchedule: (id) => {
    set((s) => ({ schedules: s.schedules.filter((sc) => sc.id !== id) }));
    get().persist();
  },

  toggleSchedule: (id) => {
    set((s) => ({
      schedules: s.schedules.map((sc) =>
        sc.id === id ? { ...sc, enabled: !sc.enabled } : sc
      ),
    }));
    get().persist();
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<UserPreferences>;
        set({ ...defaultPreferences, ...saved, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch (_) {
      set({ isHydrated: true });
    }
  },

  persist: async () => {
    try {
      const { followedTopicIds, followedCreatorIds, blockedKeywords, boostedKeywords,
        blockedCreatorIds, blockedTopicIds, schedules } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ followedTopicIds, followedCreatorIds, blockedKeywords,
          boostedKeywords, blockedCreatorIds, blockedTopicIds, schedules })
      );
    } catch (_) {}
  },
}));
