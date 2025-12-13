export const dayLabels = ["D", "L", "M", "M", "J", "V", "S"];

export function formatDate(dateInput) {
  if (dateInput instanceof Date) {
    return dateInput.toISOString().split("T")[0];
  }
  return dateInput;
}

export function normalizeHistoryEntry(entry) {
  return {
    date: entry.date,
    minutes: Number(entry.minutes) || 0,
    exercises: Number(entry.exercises) || 0,
  };
}

function buildDayMap(history) {
  return history.reduce((acc, entry) => {
    acc[entry.date] = entry;
    return acc;
  }, {});
}

export function computeStatsFromHistory(history = []) {
  const safeHistory = Array.isArray(history) ? history.map(normalizeHistoryEntry) : [];
  const totalMinutes = safeHistory.reduce((sum, entry) => sum + (entry.minutes || 0), 0);
  const totalExercises = safeHistory.reduce((sum, entry) => sum + (entry.exercises || 0), 0);
  const dayMap = buildDayMap(safeHistory);
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

export function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}
