import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "../themeContext";
import { computeStatsFromHistory, getActivityHistory } from "../activityTracker";

const achievements = [
  {
    id: "streak_3",
    title: "Racha de 3 días",
    description: "Mantén tu postura activa durante 3 días seguidos.",
    type: "streak",
    threshold: 3,
  },
  {
    id: "streak_7",
    title: "Racha de 7 días",
    description: "Completa ejercicios 7 días seguidos.",
    type: "streak",
    threshold: 7,
  },
  {
    id: "time_60",
    title: "1 hora de cuidado",
    description: "Acumula 60 minutos de actividad postural.",
    type: "minutes",
    threshold: 60,
  },
  {
    id: "time_180",
    title: "3 horas de cuidado",
    description: "Acumula 180 minutos de actividad.",
    type: "minutes",
    threshold: 180,
  },
  {
    id: "ex_30",
    title: "30 ejercicios completados",
    description: "Alcanza 30 ejercicios terminados.",
    type: "exercises",
    threshold: 30,
  },
  {
    id: "ex_100",
    title: "100 ejercicios completados",
    description: "Alcanza 100 ejercicios terminados.",
    type: "exercises",
    threshold: 100,
  },
  {
    id: "week_consistent",
    title: "Semana constante",
    description: "Al menos 4 días activos en los últimos 7 días.",
    type: "week_consistent",
  },
];

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (!hours) {
    return `${remaining} min`;
  }

  return `${hours} h ${remaining} min`;
}

function getLastNDays(history, days) {
  const today = new Date();
  const map = history.reduce((acc, entry) => {
    acc[entry.date] = entry;
    return acc;
  }, {});

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const key = date.toISOString().split("T")[0];

    return { date: key, minutes: map[key]?.minutes || 0 };
  });
}

function isAchievementUnlocked(achievement, stats, history) {
  if (!stats) return false;

  switch (achievement.type) {
    case "streak":
      return stats.currentStreak >= (achievement.threshold || 0);
    case "minutes":
      return stats.totalMinutes >= (achievement.threshold || 0);
    case "exercises":
      return stats.totalExercises >= (achievement.threshold || 0);
    case "week_consistent": {
      const recentWeek = getLastNDays(history, 7);
      const activeDays = recentWeek.filter((day) => day.minutes > 0).length;
      return activeDays >= 4;
    }
    default:
      return false;
  }
}

function AchievementBadge({ achievement }) {
  const scale = useRef(new Animated.Value(achievement.unlocked ? 1 : 0.96)).current;

  useEffect(() => {
    if (achievement.unlocked) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.96);
    }
  }, [achievement.unlocked, scale]);

  return (
    <Animated.View
      style={[
        styles.achievementCard,
        achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked,
        { transform: [{ scale }] },
      ]}
    >
      <View
        style={[
          styles.achievementIcon,
          achievement.unlocked ? styles.achievementIconUnlocked : styles.achievementIconLocked,
        ]}
      >
        <Text style={styles.achievementEmoji}>{achievement.unlocked ? "🏅" : "🔒"}</Text>
      </View>
      <Text
        style={[
          styles.achievementTitle,
          { color: achievement.unlocked ? "#0F9BA8" : "#7A7A7A" },
        ]}
      >
        {achievement.title}
      </Text>
      <Text style={[styles.achievementDescription, { color: "#666" }]}>{achievement.description}</Text>
      {!achievement.unlocked && <Text style={styles.lockedLabel}>Bloqueado</Text>}
    </Animated.View>
  );
}

export default function ProgressScreen({ activeTabKey, isPremium, navigation }) {
  const { colors } = useAppTheme();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const flameScale = useRef(new Animated.Value(1)).current;

  const loadStats = useCallback(async () => {
    const storedHistory = await getActivityHistory();
    setHistory(storedHistory);
    setStats(computeStatsFromHistory(storedHistory));
  }, []);

  useEffect(() => {
    if (activeTabKey === "progress") {
      loadStats();
    }
  }, [activeTabKey, loadStats]);

  const shouldShowDashboard = activeTabKey === "progress" && isPremium;

  const totalMinutes = stats?.totalMinutes ?? 0;
  const totalExercises = stats?.totalExercises ?? 0;
  const currentStreak = stats?.currentStreak ?? 0;

  const activeDays = useMemo(() => history.filter((day) => day.minutes > 0).length, [history]);
  const avgPerDay = useMemo(
    () => (activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0),
    [activeDays, totalMinutes]
  );

  const computedAchievements = useMemo(
    () => achievements.map((achievement) => ({
      ...achievement,
      unlocked: isAchievementUnlocked(achievement, stats, history),
    })),
    [history, stats]
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(flameScale, { toValue: 1.08, duration: 220, useNativeDriver: true }),
      Animated.spring(flameScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [currentStreak, flameScale]);

  const streakMessage = useMemo(() => {
    if (currentStreak === 0) return "Tu llama está congelada. Empieza hoy una nueva racha.";
    if (currentStreak > 0 && currentStreak < 3) return "Buen comienzo, no rompas la cadena.";
    if (currentStreak >= 3 && currentStreak < 7) return "¡Gran racha! Sigue constante.";
    return "Racha épica. Tu postura te lo agradece.";
  }, [currentStreak]);

  const flameStyle = useMemo(() => {
    if (currentStreak === 0) {
      return { color: "#90CAF9" };
    }
    if (currentStreak < 4) {
      return { color: "#FFB74D" };
    }
    return { color: "#FF7043" };
  }, [currentStreak]);

  const handleStreakPress = useCallback(() => {
    if (typeof navigation?.navigate === "function") {
      navigation.navigate("StreakDetail");
    }
  }, [navigation]);

  const handleExport = async () => {
    const exportPayload = {
      activityHistory: history,
      totalMinutes,
      totalExercises,
      currentStreak,
    };

    console.log("[Progress Export]", JSON.stringify(exportPayload, null, 2));
    Alert.alert("Exportación lista", "Tus datos se han preparado en formato JSON (ver consola).");

    try {
      await Share.share({
        message: JSON.stringify(exportPayload, null, 2),
      });
    } catch (error) {
      console.log("Share cancelado o fallido", error);
    }
  };

  if (!shouldShowDashboard) {
    return (
      <View style={[styles.lockedContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.placeholderCard, { borderColor: colors.border }]}>
          <Text style={[styles.placeholderTitle, { color: colors.textPrimary }]}>Seguimiento de progreso</Text>
          <Text style={[styles.placeholderSubtitle, { color: colors.textSecondary }]}>
            Desbloquea tu membresía para revisar tus rachas, estadísticas y logros.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.progressContainer} contentContainerStyle={styles.progressContent}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Tu progreso postural</Text>
        <Text style={styles.pageSubtitle}>Revisa tu constancia y logros.</Text>
      </View>

      <TouchableOpacity style={styles.newStreakCard} onPress={handleStreakPress} activeOpacity={0.9}>
        <View style={styles.streakIconWrapper}>
          <Animated.Text style={[styles.streakFlame, flameStyle, { transform: [{ scale: flameScale }] }]}>
            {currentStreak === 0 ? "❄️" : "🔥"}
          </Animated.Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakSubtitle}>días de racha</Text>
          <Text style={styles.streakMessage}>{streakMessage}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Tiempo total</Text>
          <Text style={styles.statValue}>{formatMinutes(totalMinutes)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Ejercicios</Text>
          <Text style={styles.statValue}>{totalExercises}</Text>
        </View>
      </View>
      <View style={styles.statCardFull}>
        <Text style={styles.statLabel}>Promedio diario</Text>
        <Text style={styles.statValue}>{avgPerDay} min/día activo</Text>
      </View>

      <View style={styles.achievementsHeader}>
        <Text style={styles.sectionTitle}>Logros e insignias</Text>
      </View>
      <FlatList
        data={computedAchievements}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementList}
        renderItem={({ item }) => <AchievementBadge achievement={item} />}
      />

      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <Text style={styles.exportButtonText}>Exportar datos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  progressContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#475569",
  },
  newStreakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B5563",
    borderRadius: 22,
    padding: 18,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  streakIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF7043",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  streakFlame: {
    fontSize: 36,
  },
  streakNumber: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 2,
  },
  streakSubtitle: {
    color: "#E2F3F3",
    fontSize: 16,
    fontWeight: "700",
  },
  streakMessage: {
    color: "#D7E3EC",
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 8,
  },
  statCardFull: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 22,
    color: "#0F172A",
    fontWeight: "bold",
  },
  achievementsHeader: {
    marginTop: 4,
  },
  achievementList: {
    gap: 12,
  },
  achievementCard: {
    width: 200,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  achievementUnlocked: {
    backgroundColor: "#E8FBFB",
  },
  achievementLocked: {
    backgroundColor: "#F1F5F9",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  achievementIconUnlocked: {
    backgroundColor: "#0F9BA810",
  },
  achievementIconLocked: {
    backgroundColor: "#CBD5E1",
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  lockedLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  exportButton: {
    marginTop: 8,
    backgroundColor: "#0F9BA8",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  exportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  lockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  placeholderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  placeholderSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
