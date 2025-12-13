import AsyncStorage from "@react-native-async-storage/async-storage";

import { PROGRESS_STORAGE_KEYS } from "./utils/progressStorage";
import { computeStatsFromHistory, formatDate, normalizeHistoryEntry } from "./utils/progressUtils";

const STORAGE_KEY = PROGRESS_STORAGE_KEYS.activityHistory;

export async function getActivityHistory() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => normalizeHistoryEntry(entry));
  } catch (error) {
    console.warn("[ActivityTracker] Error reading history", error);
    return [];
  }
}

export async function recordSession({ date, minutes = 0, exercises = 0 }) {
  const safeDate = formatDate(date);
  const history = await getActivityHistory();
  const existingIndex = history.findIndex((entry) => entry.date === safeDate);

  if (existingIndex >= 0) {
    history[existingIndex] = {
      ...history[existingIndex],
      minutes: (history[existingIndex].minutes || 0) + minutes,
      exercises: (history[existingIndex].exercises || 0) + exercises,
    };
  } else {
    history.push({
      date: safeDate,
      minutes,
      exercises,
    });
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
}

export { computeStatsFromHistory };
