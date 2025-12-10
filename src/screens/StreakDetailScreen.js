import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { computeStatsFromHistory, getActivityHistory } from "../activityTracker";
import { useAppTheme } from "../themeContext";

const palette = {
  primary: "#055F67",
  softGreen: "#9EB998",
  lightBackground: "#EDEDDD",
  midGreen: "#67917D",
  darkGreen: "#0A393C",
  mutedBorder: "#D6D8D3",
};

const dayInitials = ["D", "L", "M", "M", "J", "V", "S"];

export default function StreakDetailScreen({ navigation }) {
  const { colors } = useAppTheme();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const flameScale = useRef(new Animated.Value(1)).current;

  const loadStats = useCallback(async () => {
    const storedHistory = await getActivityHistory();
    setHistory(storedHistory);
    setStats(computeStatsFromHistory(storedHistory));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const historyMap = useMemo(
    () =>
      history.reduce((acc, entry) => {
        acc[entry.date] = entry;
        return acc;
      }, {}),
    [history]
  );

  const monthActiveDays = useMemo(() => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    return history.filter((entry) => {
      const date = new Date(entry.date);
      return (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonthIndex &&
        (entry.minutes || 0) > 0
      );
    }).length;
  }, [currentMonth, history]);

  const currentStreak = stats?.currentStreak ?? 0;
  const flameStyle = useMemo(() => {
    if (currentStreak === 0) return { color: "#90CAF9" };
    if (currentStreak < 4) return { color: "#FFB74D" };
    return { color: "#FF7043" };
  }, [currentStreak]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(flameScale, { toValue: 1.08, duration: 220, useNativeDriver: true }),
      Animated.spring(flameScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [currentStreak, flameScale]);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth]
  );

  const daysInMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(),
    [currentMonth]
  );

  const firstDayOffset = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(),
    [currentMonth]
  );

  const today = useMemo(() => new Date(), []);

  const handleMonthChange = useCallback(
    (direction) => {
      setCurrentMonth((prev) => {
        const next = new Date(prev);
        next.setMonth(prev.getMonth() + direction);
        return next;
      });
      setSelectedDay(null);
    },
    []
  );

  const handleShare = useCallback(() => {
    Alert.alert("Compartir", "Pronto podrás compartir tu racha con amigos.");
  }, []);

  const handleRewardsPress = useCallback(() => {
    Alert.alert("Recompensas", "Próximamente podrás reclamar más recompensas.");
  }, []);

  const handleDayPress = useCallback(
    (dayNumber) => {
      if (!dayNumber) return;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
      const key = date.toISOString().split("T")[0];
      setSelectedDay({ key, date, entry: historyMap[key] });
    },
    [currentMonth, historyMap]
  );

  const renderDayCell = (dayNumber, index) => {
    if (!dayNumber) {
      return <View key={`empty-${index}`} style={styles.dayCell} />;
    }

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
    const key = date.toISOString().split("T")[0];
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const entry = historyMap[key];
    const isActive = (entry?.minutes || 0) > 0;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isSelected = selectedDay?.key === key;

    const circleStyles = [styles.dayCircle, styles.dayCircleInactive];

    if (isWeekend) {
      circleStyles.push(styles.weekendCircle);
    }

    if (isActive) {
      circleStyles.push(styles.dayCircleActive);
    }

    if (isToday) {
      circleStyles.push(styles.dayToday);
    }

    if (isSelected) {
      circleStyles.push(isActive ? styles.dayCircleSelectedActive : styles.dayCircleSelected);
    }

    return (
      <TouchableOpacity key={key} style={styles.dayCell} onPress={() => handleDayPress(dayNumber)}>
        <View style={circleStyles}>
          <Text
            style={[
              styles.dayNumber,
              isActive ? styles.dayNumberActive : null,
              isSelected && !isActive ? styles.dayNumberSelected : null,
            ]}
          >
            {dayNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const grid = useMemo(() => {
    const fillers = Array.from({ length: firstDayOffset }).map(() => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...fillers, ...days];
  }, [daysInMonth, firstDayOffset]);

  const renderSelectedSummary = () => {
    if (selectedDay) {
      const { date, entry } = selectedDay;
      if (entry) {
        return (
          <Text style={styles.selectedText}>
            {`${date.getDate()} ${date.toLocaleDateString("es-ES", { month: "long" })}: ${entry.minutes} min, ${entry.exercises} ejercicios`}
          </Text>
        );
      }

      return <Text style={styles.selectedText}>Sin actividad registrada</Text>;
    }

    if (monthActiveDays > 0) {
      const label = monthActiveDays === 1 ? "día activo" : "días activos";
      return <Text style={styles.selectedText}>{`${monthActiveDays} ${label} este mes`}</Text>;
    }

    return (
      <View style={styles.emptyStateRow}>
        <Text style={styles.snowflakeIcon}>❄️</Text>
        <Text style={styles.selectedText}>Sin actividad registrada</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background || palette.lightBackground }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.headerButton}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Días de racha</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Text style={styles.headerIcon}>⤴</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {[
          { key: "personal", label: "PERSONAL" },
          { key: "friends", label: "ENTRE AMIGOS" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
              {isActive ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "personal" ? (
          <View style={styles.tabContent}>
            <View style={styles.streakHighlight}>
              <Animated.Text style={[styles.bigFlame, flameStyle, { transform: [{ scale: flameScale }] }]}>
                {currentStreak === 0 ? "❄️" : "🔥"}
              </Animated.Text>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>días de racha</Text>
            </View>

            <View style={styles.messageCard}>
              {currentStreak === 0 ? (
                <>
                  <Text style={styles.messageTitle}>Te quedaste sin racha.</Text>
                  <Text style={styles.messageBody}>Empieza hoy para recuperar tu progreso.</Text>
                  <TouchableOpacity onPress={handleRewardsPress}>
                    <Text style={styles.messageAction}>QUIERO MÁS RECOMPENSAS</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.messageTitle}>¡Sigue así!</Text>
                  <Text style={styles.messageBody}>Cada día activo refuerza tu postura.</Text>
                </>
              )}
            </View>

            <Text style={styles.sectionTitle}>Calendario de racha</Text>
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.monthButton}>
                  <Text style={styles.monthArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.monthButton}>
                  <Text style={styles.monthArrow}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekRow}>
                {dayInitials.map((day, index) => (
                  <Text key={`${day}-${index}`} style={styles.weekLabel}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>{grid.map((day, index) => renderDayCell(day, index))}</View>

              <View style={styles.selectedContainer}>{renderSelectedSummary()}</View>
            </View>
          </View>
        ) : (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>Próximamente: compara tu racha con amigos</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.lightBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 20,
    color: palette.darkGreen,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.darkGreen,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#dfe7df",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.mutedBorder,
  },
  tabButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.darkGreen,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
  tabIndicator: {
    marginTop: 6,
    height: 3,
    width: "40%",
    backgroundColor: palette.softGreen,
    borderRadius: 6,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  tabContent: {
    gap: 20,
  },
  streakHighlight: {
    alignItems: "center",
    backgroundColor: palette.primary,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  bigFlame: {
    fontSize: 48,
  },
  streakNumber: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    marginTop: 4,
  },
  streakLabel: {
    color: "#E2F3F3",
    fontSize: 16,
    marginTop: 4,
  },
  messageCard: {
    backgroundColor: "#F5F8F6",
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.darkGreen,
  },
  messageBody: {
    color: "#4b5a55",
    fontSize: 14,
  },
  messageAction: {
    color: palette.midGreen,
    fontWeight: "800",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.darkGreen,
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  monthButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: palette.lightBackground,
    borderWidth: 1,
    borderColor: palette.mutedBorder,
  },
  monthArrow: {
    fontSize: 18,
    color: palette.darkGreen,
    fontWeight: "800",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.darkGreen,
    textTransform: "capitalize",
    flex: 1,
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  weekLabel: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: palette.midGreen,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    marginVertical: 6,
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dayCircleActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  dayCircleInactive: {
    borderColor: palette.mutedBorder,
    backgroundColor: "#FFFFFF",
  },
  weekendCircle: {
    backgroundColor: "#f3f5f2",
  },
  dayToday: {
    borderColor: palette.primary,
    borderWidth: 2,
  },
  dayCircleSelected: {
    borderWidth: 2,
    borderColor: palette.primary,
    backgroundColor: "#f6faf8",
    shadowColor: palette.primary,
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  dayCircleSelectedActive: {
    borderWidth: 2,
    borderColor: "#cde0da",
    backgroundColor: palette.primary,
  },
  dayNumber: {
    color: palette.darkGreen,
    fontWeight: "700",
  },
  dayNumberActive: {
    color: "#FFFFFF",
  },
  dayNumberSelected: {
    color: palette.primary,
  },
  selectedContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: palette.lightBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.mutedBorder,
  },
  selectedText: {
    color: palette.darkGreen,
    fontWeight: "700",
  },
  emptyStateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  snowflakeIcon: {
    fontSize: 18,
  },
  comingSoon: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  comingSoonText: {
    textAlign: "center",
    color: "#475569",
    fontWeight: "700",
  },
});
