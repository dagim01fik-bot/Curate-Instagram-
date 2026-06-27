import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedbackSignal } from '../types/feedback';
import { useFeedStore } from '../store/useFeedStore';

const FEEDBACK_STORAGE_KEY = 'feedbackHistory';

export async function processFeedback(signal: FeedbackSignal): Promise<void> {
  useFeedStore.getState().addFeedback(signal);

  try {
    const existing = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
    const history: FeedbackSignal[] = existing ? JSON.parse(existing) : [];
    history.push(signal);
    const trimmed = history.slice(-500);
    await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (_) {}
}

export async function loadFeedbackHistory(): Promise<FeedbackSignal[]> {
  try {
    const raw = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export async function clearFeedbackHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FEEDBACK_STORAGE_KEY);
    useFeedStore.getState().resetFeedbackHistory();
  } catch (_) {}
}
