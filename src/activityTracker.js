import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@posturaU_activityHistory";
const dayLabels = ["D", "L", "M", "M", "J", "V", "S"];

function formatDate(dateInput) {
  if (dateInput instanceof Date) {
    return dateInput.toISOString().split("T")[0];
  }
  return dateInput;
}

export async function getActivityHistory() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => ({
      date: entry.date,
      minutes: Number(entry.minutes) || 0,
      exercises: Number(entry.exercises) || 0,
    }));
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

function buildDayMap(history) {
  return history.reduce((acc, entry) => {
    acc[entry.date] = entry;
    return acc;
  }, {});
}

export function computeStatsFromHistory(history = []) {
  const totalMinutes = history.reduce((sum, entry) => sum + (entry.minutes || 0), 0);
  const totalExercises = history.reduce((sum, entry) => sum + (entry.exercises || 0), 0);
  const dayMap = buildDayMap(history);
  const today = new Date();

  const last14Days = [];
  let currentStreak = 0;

  for (let i = 0; i < 14; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = formatDate(date);
    const minutes = dayMap[key]?.minutes || 0;

    if (i === currentStreak && minutes > 0) {
      currentStreak += 1;
    }

    last14Days.push({
      date: key,
      minutes,
      label: dayLabels[date.getDay()],
    });
  }

  return {
    totalMinutes,
    totalExercises,
    currentStreak,
    last14Days,
  };
}
