import AsyncStorage from "@react-native-async-storage/async-storage";

import { computeStatsFromHistory, getTodayKey, normalizeHistoryEntry } from "./progressUtils";

export const PROGRESS_STORAGE_KEYS = {
  activityHistory: "@posturaU_activityHistory",
  learningFavorites: "LEARNING_FAVORITES",
  learningHistory: "LEARNING_HISTORY",
  learningContent: "LEARNING_CONTENT",
  dailyExercise: "moveup_daily_exercise",
  progressOverrides: "@posturaU_progressOverrides",
};

const listeners = new Set();

function notify(snapshot) {
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.warn("[ProgressStorage] listener error", error);
    }
  });
}

export function subscribeProgress(listener) {
  if (typeof listener !== "function") return () => {};
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getActivityHistoryStorage() {
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEYS.activityHistory);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeHistoryEntry) : [];
  } catch (error) {
    console.warn("[ProgressStorage] error reading activity history", error);
    return [];
  }
}

export async function saveActivityHistory(history) {
  try {
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEYS.activityHistory, JSON.stringify(history || []));
  } catch (error) {
    console.warn("[ProgressStorage] error saving activity history", error);
  }
}

async function getProgressOverrides() {
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEYS.progressOverrides);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("[ProgressStorage] error reading overrides", error);
    return {};
  }
}

function applyOverrides(stats, overrides = {}, history = []) {
  const activeDays = history.filter((entry) => entry.minutes > 0).length;
  const baseAvg = activeDays > 0 ? Math.round((stats.totalMinutes || 0) / activeDays) : 0;

  const hasStreak = typeof overrides.streakDays === "number";
  const hasTotal = typeof overrides.totalTime === "number";
  const hasAvg = typeof overrides.avgDailyTime === "number";
  const totalMinutes = hasTotal ? Math.max(0, overrides.totalTime) : stats.totalMinutes;
  const avgDailyTime = hasAvg ? Math.max(0, overrides.avgDailyTime) : hasTotal ? Math.max(0, overrides.totalTime) : baseAvg;

  return {
    ...stats,
    currentStreak: hasStreak ? Math.max(0, Math.floor(overrides.streakDays)) : stats.currentStreak,
    totalMinutes,
    avgDailyTime,
  };
}

export async function getProgressSnapshot() {
  const [history, overrides, learningHistoryRaw] = await Promise.all([
    getActivityHistoryStorage(),
    getProgressOverrides(),
    AsyncStorage.getItem(PROGRESS_STORAGE_KEYS.learningHistory),
  ]);

  const stats = computeStatsFromHistory(history);
  const applied = applyOverrides(stats, overrides, history);
  const learningHistory = learningHistoryRaw ? JSON.parse(learningHistoryRaw) : [];

  const snapshot = {
    history,
    stats: { ...applied, overrides },
    learningHistoryLength: Array.isArray(learningHistory) ? learningHistory.length : 0,
  };

  return snapshot;
}

export async function resetProgress() {
  const emptyHistory = [];

  await Promise.all([
    AsyncStorage.setItem(PROGRESS_STORAGE_KEYS.activityHistory, JSON.stringify(emptyHistory)),
    AsyncStorage.setItem(PROGRESS_STORAGE_KEYS.learningHistory, JSON.stringify([])),
    AsyncStorage.removeItem(PROGRESS_STORAGE_KEYS.progressOverrides),
    AsyncStorage.removeItem(PROGRESS_STORAGE_KEYS.dailyExercise),
  ]);

  const snapshot = {
    history: emptyHistory,
    stats: { totalMinutes: 0, totalExercises: 0, currentStreak: 0, last14Days: [], avgDailyTime: 0, overrides: {} },
    learningHistoryLength: 0,
  };

  notify(snapshot);
  return snapshot;
}

export async function setProgressOverrides({ streakDays, totalTime, avgDailyTime }) {
  const safeValues = {};

  const hasStreak = typeof streakDays === "number" && !Number.isNaN(streakDays);
  const hasTotal = typeof totalTime === "number" && !Number.isNaN(totalTime);
  const hasAvg = typeof avgDailyTime === "number" && !Number.isNaN(avgDailyTime);

  if (hasStreak) safeValues.streakDays = Math.max(0, Math.floor(streakDays));
  if (hasTotal) safeValues.totalTime = Math.max(0, totalTime);
  if (hasAvg) safeValues.avgDailyTime = Math.max(0, avgDailyTime);

  await AsyncStorage.setItem(PROGRESS_STORAGE_KEYS.progressOverrides, JSON.stringify(safeValues));
  const snapshot = await getProgressSnapshot();
  notify(snapshot);
  return snapshot;
}

export function getTodayActivity(history = []) {
  const todayKey = getTodayKey();
  return history.find((entry) => entry.date === todayKey) ?? { date: todayKey, minutes: 0, exercises: 0 };
}
