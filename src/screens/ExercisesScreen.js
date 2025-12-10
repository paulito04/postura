import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { areas, exercises, levels } from "../data/exercises";
import { getActivityHistory, recordSession } from "../activityTracker";
import { usePoints } from "../PointsManager";
import { useUser } from "../UserContext";
import { useAppTheme } from "../themeContext";

const ExerciseCard = ({ exercise, onPress, onToggleFavorite, isFavorite, colors }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(exercise)}
    >
      <Image source={exercise.image} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {exercise.name}
          </Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => onToggleFavorite(exercise.id)}>
            <Text style={{ fontSize: 18 }}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {Math.round(exercise.duration / 60)} min · {exercise.area} · {exercise.level}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RoutinePlayer = ({
  exercise,
  onFinish,
  routineTimeLeft,
  setRoutineTimeLeft,
  currentStepIndex,
  setCurrentStepIndex,
  isPlayingRoutine,
  colors,
}) => {
  const frames = useMemo(() => [exercise.image || require("../../assets/logo.jpg")], [exercise.image]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [frames]);

  useEffect(() => {
    if (!frames || frames.length <= 1) return undefined;

    let isMounted = true;
    const interval = setInterval(() => {
      if (!isMounted) return;
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [frames]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(routineTimeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (routineTimeLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [routineTimeLeft]);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, [setCurrentStepIndex]);

  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(exercise.steps.length - 1, prev + 1));
  }, [exercise.steps.length, setCurrentStepIndex]);

  const progress = ((currentStepIndex + 1) / exercise.steps.length) * 100;

  useEffect(() => {
    if (!isPlayingRoutine || routineTimeLeft <= 0) return undefined;
    const interval = setInterval(() => {
      setRoutineTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayingRoutine, routineTimeLeft, setRoutineTimeLeft]);

  return (
    <ScrollView contentContainerStyle={styles.playerContainer}>
      <Text style={[styles.playerTitle, { color: colors.textPrimary }]}>{exercise.name}</Text>
      <View style={styles.imageContainer}>
        <Image source={frames[frameIndex]} style={styles.exerciseImage} resizeMode="contain" />
      </View>

      <View style={[styles.timerBox, { backgroundColor: `${colors.primary}10`, borderColor: colors.border }]}>
        <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>Tiempo restante</Text>
        <Text style={[styles.timerValue, { color: colors.primary }]}>{formattedTime}</Text>
        {routineTimeLeft === 0 ? (
          <Text style={[styles.completedText, { color: colors.textSecondary }]}>Rutina completada</Text>
        ) : null}
      </View>

      <View style={styles.stepsSection}>
        <View style={styles.stepsHeader}>
          <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Instrucción</Text>
          <Text style={[styles.stepProgressText, { color: colors.textSecondary }]}>
            Paso {currentStepIndex + 1} de {exercise.steps.length}
          </Text>
        </View>
        <View style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.stepText, { color: colors.textPrimary }]}>{exercise.steps[currentStepIndex]}</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.stepButtonsRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border, opacity: currentStepIndex === 0 ? 0.5 : 1 }]}
              onPress={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                  opacity: currentStepIndex === exercise.steps.length - 1 ? 0.5 : 1,
                },
              ]}
              onPress={handleNext}
              disabled={currentStepIndex === exercise.steps.length - 1}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.finishButton, { backgroundColor: colors.primary }]} onPress={onFinish}>
        <Text style={styles.finishButtonText}>Terminar rutina</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default function ExercisesScreen({ tabParams }) {
  const { colors } = useAppTheme();
  const { addPoints } = usePoints();
  const { user } = useUser();
  const [exerciseAreaFilter, setExerciseAreaFilter] = useState("todos");
  const [exerciseLevelFilter, setExerciseLevelFilter] = useState("todos");
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isPlayingRoutine, setIsPlayingRoutine] = useState(false);
  const [routineTimeLeft, setRoutineTimeLeft] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const challenge = tabParams?.challenge;

  const toggleFavorite = useCallback((id) => {
    setFavoriteExerciseIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesArea = exerciseAreaFilter === "todos" || exercise.area === exerciseAreaFilter;
      const matchesLevel = exerciseLevelFilter === "todos" || exercise.level === exerciseLevelFilter;
      const matchesFavorite = !showFavoritesOnly || favoriteExerciseIds.includes(exercise.id);
      return matchesArea && matchesLevel && matchesFavorite;
    });
  }, [exerciseAreaFilter, exerciseLevelFilter, favoriteExerciseIds, showFavoritesOnly]);

  const handleSelectExercise = useCallback((exercise) => {
    setSelectedExercise(exercise);
    setIsPlayingRoutine(true);
    setRoutineTimeLeft(exercise.duration);
    setCurrentStepIndex(0);
  }, []);

  const isProUser = user?.plan === "MoveUp Pro" || user?.isPro === true;

  const handleFinishRoutine = useCallback(async () => {
    const existingHistory = await getActivityHistory();

    let updatedHistory = existingHistory;

    if (selectedExercise) {
      const todayKey = new Date().toISOString().split("T")[0];
      const minutes = Math.max(1, Math.round(selectedExercise.duration / 60));

      updatedHistory = await recordSession({ date: todayKey, minutes, exercises: 1 });

      addPoints(20, "Rutina de ejercicios completada", isProUser);
    }

    setIsPlayingRoutine(false);
    setSelectedExercise(null);
    setRoutineTimeLeft(0);
    setCurrentStepIndex(0);
  }, [addPoints, isProUser, selectedExercise]);

  const renderFilterRow = (items, value, onChange) => (
    <View style={styles.filterRow}>
      {items.map((option) => {
        const isActive = value === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.chip,
              {
                borderColor: isActive ? colors.primary : colors.border,
                backgroundColor: isActive ? `${colors.primary}15` : colors.surface,
              },
            ]}
            onPress={() => onChange(option.key)}
          >
            <Text style={[styles.chipLabel, { color: isActive ? colors.primary : colors.textSecondary }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (isPlayingRoutine && selectedExercise) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <RoutinePlayer
          exercise={selectedExercise}
          onFinish={handleFinishRoutine}
          routineTimeLeft={routineTimeLeft}
          setRoutineTimeLeft={setRoutineTimeLeft}
          currentStepIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
          isPlayingRoutine={isPlayingRoutine}
          colors={colors}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            {challenge ? (
              <View style={[styles.challengeBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Text style={[styles.bannerEyebrow, { color: colors.primaryDark }]}>Desafío del día</Text>
                <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>{challenge.title}</Text>
                <Text style={[styles.bannerDescription, { color: colors.textSecondary }]}>{challenge.description}</Text>
              </View>
            ) : null}

              <View style={styles.filtersBlock}>
                <Text style={[styles.filtersTitle, { color: colors.textPrimary }]}>Zona corporal</Text>
                <View style={styles.filterRow}>
                  <TouchableOpacity
                    style={[styles.filterChip, exerciseAreaFilter === "cuello" && styles.filterChipActive]}
                    onPress={() => setExerciseAreaFilter("cuello")}
                  >
                    <ImageBackground
                      source={require("../../assets/filtros/cuello.png")}
                      style={styles.filterImage}
                      imageStyle={styles.filterImageRadius}
                    />
                    <Text
                      style={[styles.filterLabel, exerciseAreaFilter === "cuello" && styles.filterLabelActive]}
                    >
                      Cuello
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, exerciseAreaFilter === "espalda" && styles.filterChipActive]}
                    onPress={() => setExerciseAreaFilter("espalda")}
                  >
                    <ImageBackground
                      source={require("../../assets/filtros/espalda.png")}
                      style={styles.filterImage}
                      imageStyle={styles.filterImageRadius}
                    />
                    <Text
                      style={[styles.filterLabel, exerciseAreaFilter === "espalda" && styles.filterLabelActive]}
                    >
                      Espalda
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, exerciseAreaFilter === "hombros" && styles.filterChipActive]}
                    onPress={() => setExerciseAreaFilter("hombros")}
                  >
                    <ImageBackground
                      source={require("../../assets/filtros/hombros.png")}
                      style={styles.filterImage}
                      imageStyle={styles.filterImageRadius}
                    />
                    <Text
                      style={[styles.filterLabel, exerciseAreaFilter === "hombros" && styles.filterLabelActive]}
                    >
                      Hombros
                    </Text>
                  </TouchableOpacity>
                </View>
              <Text style={[styles.filtersTitle, { color: colors.textPrimary }]}>Nivel</Text>
              {renderFilterRow(levels, exerciseLevelFilter, setExerciseLevelFilter)}
              <View style={styles.favoritesRow}>
                <Text style={[styles.filtersTitle, { color: colors.textPrimary }]}>Solo favoritos</Text>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    {
                      borderColor: showFavoritesOnly ? colors.primary : colors.border,
                      backgroundColor: showFavoritesOnly ? `${colors.primary}15` : colors.surface,
                    },
                  ]}
                  onPress={() => setShowFavoritesOnly((prev) => !prev)}
                >
                  <Text style={[styles.chipLabel, { color: showFavoritesOnly ? colors.primary : colors.textSecondary }]}>
                    {showFavoritesOnly ? "Activado" : "Desactivado"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            onPress={handleSelectExercise}
            onToggleFavorite={toggleFavorite}
            isFavorite={favoriteExerciseIds.includes(item.id)}
            colors={colors}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No hay ejercicios</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Ajusta los filtros o desactiva favoritos</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  headerStack: {
    gap: 14,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
  },
  cardImage: {
    width: 86,
    height: 86,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  challengeBanner: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  bannerEyebrow: {
    fontSize: 13,
    fontWeight: "800",
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: "800",
  },
  bannerDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  filtersBlock: {
    gap: 8,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterChip: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  filterImage: {
    width: "100%",
    height: 80,
  },
  filterImageRadius: {
    borderRadius: 16,
  },
  filterLabel: {
    marginTop: 4,
    fontSize: 13,
    color: "#0A393C",
    textAlign: "center",
  },
  filterLabelActive: {
    fontWeight: "bold",
  },
  filterChipActive: {
    borderWidth: 2,
    borderColor: "#055F67",
    borderRadius: 18,
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  favoritesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  favoriteButton: {
    paddingHorizontal: 8,
  },
  playerContainer: {
    padding: 16,
    gap: 14,
  },
  playerTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  exerciseImage: {
    width: "100%",
    height: "100%",
  },
  timerBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  timerLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  timerValue: {
    fontSize: 32,
    fontWeight: "800",
  },
  completedText: {
    fontSize: 14,
    fontWeight: "700",
  },
  stepsSection: {
    gap: 8,
  },
  stepsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  stepProgressText: {
    fontSize: 13,
    fontWeight: "700",
  },
  stepCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  stepText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
  },
  stepButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
  finishButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});
