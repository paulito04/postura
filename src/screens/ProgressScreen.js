import React, { useEffect, useMemo, useRef } from "react";
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
import { achievements as baseAchievements, activityHistory } from "../data/progress";
import { useAppTheme } from "../themeContext";

const dayLabels = ["D", "L", "M", "M", "J", "V", "S"];

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (!hours) {
    return `${remaining} min`;
  }

  return `${hours} h ${remaining} min`;
}

function getCurrentStreak(history) {
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i].minutes > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
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

export default function ProgressScreen({ activeTabKey, isPremium }) {
  const { colors } = useAppTheme();

  const shouldShowDashboard = activeTabKey === "progress" && isPremium;

  const last14Days = useMemo(() => {
    return [...activityHistory]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14)
      .map((day) => ({
        ...day,
        label: dayLabels[new Date(day.date).getDay()],
      }));
  }, []);

  const totalMinutes = useMemo(
    () => activityHistory.reduce((sum, entry) => sum + entry.minutes, 0),
    []
  );
  const totalExercises = useMemo(
    () => activityHistory.reduce((sum, entry) => sum + entry.exercises, 0),
    []
  );

  const currentStreak = useMemo(() => getCurrentStreak(activityHistory), []);
  const activeDays = useMemo(() => activityHistory.filter((day) => day.minutes > 0).length, []);
  const avgPerDay = useMemo(
    () => (activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0),
    [activeDays, totalMinutes]
  );

  const computedAchievements = useMemo(() => {
    return baseAchievements.map((achievement) => {
      if (achievement.id === "streak_3") {
        return { ...achievement, unlocked: currentStreak >= 3 };
      }
      if (achievement.id === "streak_7") {
        return { ...achievement, unlocked: currentStreak >= 7 };
      }
      return achievement;
    });
  }, [currentStreak]);

  const handleExport = async () => {
    const exportPayload = {
      activityHistory,
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

      <View style={styles.streakCard}>
        <Text style={styles.sectionTitle}>Racha de días activos</Text>
        <View style={styles.streakRow}>
          {last14Days.map((day) => (
            <View key={day.date} style={styles.streakDay}>
              <View
                style={[
                  styles.streakCircle,
                  day.minutes > 0 ? styles.streakCircleActive : styles.streakCircleInactive,
                ]}
              />
              <Text style={styles.streakLabel}>{day.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.streakSummary}>Racha actual: {currentStreak} días</Text>
      </View>

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
  streakCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  streakRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  streakDay: {
    alignItems: "center",
    width: 44,
  },
  streakCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7E3EC",
    backgroundColor: "#F8FAFC",
  },
  streakCircleActive: {
    backgroundColor: "#0F9BA8",
    borderColor: "#0F9BA8",
  },
  streakCircleInactive: {
    backgroundColor: "#F8FAFC",
  },
  streakLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  streakSummary: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "600",
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
