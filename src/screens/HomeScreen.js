import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppState } from "../context/AppStateContext";
import { useTheme } from "../theme/ThemeProvider";
import { computeStatsFromHistory, getActivityHistory } from "../activityTracker";
import SummaryCard from "../components/SummaryCard";
import { useUser } from "../UserContext";

const durationOptions = [30, 45, 60];
const GREETINGS = [
  "Hola",
  "Buenos días",
  "¿Qué tal?",
  "¿Cómo andas?",
  "¿Listo para empezar?",
  "¡A darle!",
  "Dios te bendiga",
  "¡Qué gusto verte!",
  "Hola de nuevo",
  "Hola, ¿cómo te sientes hoy?",
  "¡Vamos a por ello!",
];
const tipList = [
  "Pantalla a la altura de los ojos",
  "Espalda recta apoyada en el respaldo",
  "Pies totalmente apoyados en el suelo",
  "Rodillas a 90 grados",
  "Codos a la altura de la mesa",
  "Muñecas rectas al teclear",
  "Hombros relajados, no elevados",
  "Mira a lo lejos cada 20 minutos",
  "Levántate cada 45-60 minutos",
  "Usa apoyabrazos si están disponibles",
  "Evita cruzar las piernas",
  "Teclado a unos 15 cm del borde",
  "Mouse cerca del teclado",
  "Iluminación adecuada, sin reflejos",
  "Ajusta el brillo de la pantalla",
  "Cuello alineado con la columna",
  "Respira profundamente varias veces",
  "Gira los hombros hacia atrás",
  "Estira los dedos y muñecas",
  "Haz rotaciones de cuello suaves",
];

export default function HomeScreen({ navigation }) {
  const { theme, mode } = useTheme();
  const { colors } = theme;
  const isDarkMode = mode === "dark";
  const { discomfortLevel } = useAppState();
  const { user } = useUser();

  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [notificationType, setNotificationType] = useState(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(null);

  const [selectedDuration, setSelectedDuration] = useState(45);
  const [streakDays, setStreakDays] = useState(0);
  const [streakGoal] = useState(7);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const [activityGoal] = useState(3);
  const [showNotificationDot] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [greeting, setGreeting] = useState("");

  const scrollRef = useRef(null);
  const snackbarTimeout = useRef(null);

  const palette = useMemo(
    () => ({
      primary: colors.primary,
      deepTeal: colors.primaryText,
      accent: colors.secondary,
      softAccent: colors.secondaryText,
      sand: colors.background,
      card: colors.card,
      midGreen: colors.secondary,
      darkGreen: colors.primaryText,
      mutedBorder: colors.borderSoft || colors.border,
    }),
    [colors.background, colors.border, colors.borderSoft, colors.card, colors.primary, colors.primaryText, colors.secondary, colors.secondaryText]
  );

  const challengeOfDay = useMemo(
    () => ({
      title: "Estiramiento de cuello lateral",
      description: "Alivia tensión cervical con 3 series de 20 segundos por lado.",
    }),
    []
  );

  useEffect(() => {
    const loadWelcomeFlag = async () => {
      try {
        const value = await AsyncStorage.getItem("moveup_hasSeenWelcome");
        setHasSeenWelcome(value === "true");
      } catch (error) {
        console.warn("Error reading welcome flag", error);
        setHasSeenWelcome(false);
      }
    };
    loadWelcomeFlag();
  }, []);

  function getRandomGreeting() {
    const index = Math.floor(Math.random() * GREETINGS.length);
    return GREETINGS[index];
  }

  useEffect(() => {
    async function loadActivity() {
      const history = await getActivityHistory();
      const stats = computeStatsFromHistory(history);
      const todayKey = new Date().toISOString().split("T")[0];
      const todayEntry = history.find((entry) => entry.date === todayKey);

      setStreakDays(stats.currentStreak);
      setActivitiesCompleted(todayEntry?.exercises ?? 0);
    }

    loadActivity();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tipList.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current && carouselWidth) {
      scrollRef.current.scrollTo({ x: currentTipIndex * carouselWidth, animated: true });
    }
  }, [carouselWidth, currentTipIndex]);

  useEffect(() => {
    return () => {
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setGreeting(getRandomGreeting());

    if (!navigation?.addListener) return undefined;

    const unsubscribe = navigation.addListener("focus", () => {
      setGreeting(getRandomGreeting());
    });

    return unsubscribe;
  }, [navigation]);

  const displayName = user?.name?.trim() || user?.username?.trim() || "Usuario";
  const successColor = colors.secondary;
  const warningColor = colors.tabBarInactive;
  const dangerColor = colors.danger;
  const discomfortColor = useMemo(() => {
    if (discomfortLevel <= 3) return successColor;
    if (discomfortLevel <= 6) return warningColor;
    return dangerColor;
  }, [dangerColor, discomfortLevel, successColor, warningColor]);

  const handleStartSession = () => {
    setSnackbarMessage(`✅ Pausa programada en ${selectedDuration} minutos`);
    if (snackbarTimeout.current) {
      clearTimeout(snackbarTimeout.current);
    }
    snackbarTimeout.current = setTimeout(() => setSnackbarMessage(""), 2600);
  };

  const handleChallengeNavigation = () => {
    navigation?.navigate?.("Ejercicios", { challenge: challengeOfDay });
  };

  const avatarInitials = (user?.name || user?.username || "Tú").slice(0, 2).toUpperCase();
  const progress = streakDays / streakGoal;
  const discomfortIcon = discomfortLevel <= 3 ? "🙂" : discomfortLevel <= 6 ? "😐" : "😣";
  const dailyExerciseTitle = challengeOfDay.title;

  const handleOpenNotifications = async () => {
    let type;

    if (hasSeenWelcome === false) {
      type = "welcome";
      await AsyncStorage.setItem("moveup_hasSeenWelcome", "true");
      setHasSeenWelcome(true);
    } else if (!user?.isPremium) {
      type = "premium";
    } else {
      type = "daily";
    }

    setNotificationType(type);
    setNotificationsVisible(true);
  };

  const handleGoToPremium = () => {
    setNotificationsVisible(false);
    navigation?.navigate?.("Perfil");
  };

  const handleGoToDailyExercise = () => {
    setNotificationsVisible(false);
    navigation?.navigate?.("Ejercicios", { challenge: challengeOfDay });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.sand }]}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerGradient}>
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.headerBackground,
                { backgroundColor: isDarkMode ? colors.surface : palette.primary },
              ]}
            />
            <View style={styles.headerContent}>
              <View style={styles.headerTopRow}>
                <View style={styles.greetingRow}>
                  <ProgressRing progress={progress} size={74} strokeWidth={6} strokeColor={palette.softAccent}>
                    <View style={[styles.avatar, { backgroundColor: palette.darkGreen }]}>
                      <Text style={[styles.avatarText, { color: isDarkMode ? colors.primaryText : "#FFFFFF" }]}>{avatarInitials}</Text>
                    </View>
                  </ProgressRing>
                  <View style={{ gap: 4 }}>
                    <Text style={[styles.headerGreeting, { color: isDarkMode ? colors.primaryText : "#FFFFFF" }]}>
                      {greeting} {displayName}!
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: isDarkMode ? colors.secondaryText : "#E5E7EB" }]}>Tu bienestar postural empieza aquí</Text>
                    <Text style={[styles.headerStatus, { color: isDarkMode ? colors.primaryText : "#FFFFFF" }]}>Nivel: Principiante · Racha: {streakDays} días</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.iconButton, { borderColor: palette.softAccent }]}
                  accessibilityLabel="Notificaciones"
                  onPress={handleOpenNotifications}
                >
                  <Text style={[styles.iconButtonText, { color: isDarkMode ? colors.primaryText : "#FFFFFF" }]}>🔔</Text>
                  {showNotificationDot ? <View style={[styles.notificationDot, { backgroundColor: colors.primary }]} /> : null}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentArea}>
          <View style={styles.summarySection}>
            <Text style={[styles.summaryTitle, { color: colors.primaryText }]}>Resumen</Text>
            <View style={styles.summaryRow}>
              <SummaryCard
                title="Racha activa"
                value={`${streakDays} días`}
                subtitle={`Objetivo ${streakGoal} días`}
                icon={<Text style={styles.summaryIcon}>🔥</Text>}
                accentColor="#F97316"
                progress={streakDays / streakGoal}
                onPress={() => navigation.navigate("StreakScreen")}
              />
              <SummaryCard
                title="Actividades de hoy"
                value={`${activitiesCompleted} / ${activityGoal}`}
                subtitle="Pausas completadas"
                icon={<Text style={styles.summaryIcon}>✅</Text>}
                accentColor="#22C55E"
                progress={activitiesCompleted / activityGoal}
                onPress={() => navigation.navigate("ExercisesToday")}
              />
              <SummaryCard
                title="Nivel de molestia"
                value={`${discomfortLevel} / 10`}
                subtitle="Actualiza tu nivel"
                icon={<Text style={styles.summaryIcon}>{discomfortIcon}</Text>}
                accentColor="#EAB308"
                progress={1 - discomfortLevel / 10}
                onPress={() => navigation.navigate("PainLevel")}
              />
            </View>
          </View>

          <Text style={[styles.miniMotivation, { color: colors.textMuted }]}>Pequeños hábitos, grandes cambios en tu postura.</Text>

          <View style={[styles.sessionCard, styles.shadow, { backgroundColor: palette.card }]}>
            <Text style={[styles.sessionTitle, { color: palette.deepTeal }]}>Tu siguiente pausa activa</Text>
            <Text style={[styles.sessionSubtitle, { color: colors.textMuted }]}>Te recomendamos una pausa cada 45 min</Text>
            <Text style={[styles.helperText, { color: colors.textMuted }]}>Elige la duración</Text>

            <View style={styles.durationRow}>
              {durationOptions.map((minutes) => {
                const isActive = selectedDuration === minutes;

                return (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.durationButton,
                      isActive
                        ? {
                            backgroundColor: palette.primary,
                            borderColor: palette.deepTeal,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 6,
                          }
                        : { backgroundColor: palette.sand, borderColor: palette.deepTeal },
                    ]}
                    onPress={() => setSelectedDuration(minutes)}
                  >
                    <Text style={[styles.durationText, { color: colors.text }]}>
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.helperText, { color: colors.textMuted }]}>Puedes cambiarlo cuando quieras en Configuración.</Text>

            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: palette.primary }]} onPress={handleStartSession}>
              <Text style={[styles.primaryButtonText, { color: colors.text }]}>▶ Comenzar ahora</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.challengeCard, styles.shadow, { backgroundColor: palette.card }]}>
            <View style={styles.challengeHeader}>
              <Text style={[styles.sectionEyebrow, { color: palette.deepTeal }]}>Desafío del día</Text>
              <Text style={styles.challengeIcon}>💪</Text>
            </View>
            <Text style={[styles.challengeTitle, { color: colors.text }]}>{challengeOfDay.title}</Text>
            <Text style={[styles.challengeDescription, { color: colors.textMuted }]}>{challengeOfDay.description}</Text>
            <TouchableOpacity style={[styles.secondaryButton, { borderColor: palette.deepTeal }]} onPress={handleChallengeNavigation}>
              <Text style={[styles.secondaryButtonText, { color: palette.deepTeal }]}>Ir al ejercicio</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.carouselCard, styles.shadow, { backgroundColor: palette.card }]}>
            <View style={styles.carouselHeader}>
              <Text style={[styles.sectionEyebrow, { color: palette.deepTeal }]}>Tips ergonómicos</Text>
              <Text style={styles.lightbulb}>💡</Text>
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              onLayout={(event) => setCarouselWidth(event.nativeEvent.layout.width)}
            >
              {tipList.map((tip, index) => (
                <View
                  key={tip}
                  style={[
                    styles.tipCard,
                    {
                      width: carouselWidth || 280,
                      backgroundColor: isDarkMode ? colors.cardAlt : colors.surface,
                      borderColor: palette.mutedBorder,
                    },
                  ]}
                >
                  <Text style={[styles.tipIndex, { color: colors.textMuted }]}>{`Tip ergonómico ${index + 1} de ${tipList.length}`}</Text>
                  <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {tipList.map((_, index) => {
                const isActive = index === currentTipIndex;
                return (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isActive ? palette.primary : palette.sand,
                        width: isActive ? 16 : 8,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {snackbarMessage ? (
        <View
          style={[
            styles.snackbar,
            { backgroundColor: isDarkMode ? colors.cardAlt : colors.surface },
          ]}
        >
          <Text style={[styles.snackbarText, { color: colors.primaryText }]}>{snackbarMessage}</Text>
        </View>
      ) : null}

      <Modal
        visible={isNotificationsVisible && notificationType !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: palette.card }]}>
            {notificationType === "welcome" && (
              <>
                <Text style={[styles.modalTitle, { color: palette.deepTeal }]}>¡Bienvenido a MoveUp!</Text>
                <Text style={[styles.modalBody, { color: colors.textMuted }]}>
                  Gracias por unirte a la comunidad. Desde hoy te ayudaremos a cuidar tu postura paso a paso.
                </Text>
                <TouchableOpacity
                  style={[styles.modalPrimaryButton, { backgroundColor: palette.primary }]}
                  onPress={() => setNotificationsVisible(false)}
                >
                  <Text style={[styles.modalPrimaryText, { color: colors.text }]}>Empezar</Text>
                </TouchableOpacity>
              </>
            )}

            {notificationType === "premium" && (
              <>
                <Text style={[styles.modalTitle, { color: palette.deepTeal }]}>Pásate a MoveUp Premium</Text>
                <Text style={[styles.modalBody, { color: colors.textMuted }]}>
                  Desbloquea estadísticas avanzadas, logros especiales y todo el contenido de "Aprender" por solo $9.99 al mes.
                </Text>
                <TouchableOpacity
                  style={[styles.modalPrimaryButton, { backgroundColor: palette.primary }]}
                  onPress={handleGoToPremium}
                >
                  <Text style={[styles.modalPrimaryText, { color: colors.text }]}>Ver beneficios</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSecondaryButton, { borderColor: palette.deepTeal }]}
                  onPress={() => setNotificationsVisible(false)}
                >
                  <Text style={[styles.modalSecondaryText, { color: palette.deepTeal }]}>Después</Text>
                </TouchableOpacity>
              </>
            )}

            {notificationType === "daily" && (
              <>
                <Text style={[styles.modalTitle, { color: palette.deepTeal }]}>Tu ejercicio del día</Text>
                <Text style={[styles.modalBody, { color: colors.textMuted }]}>
                  Hoy te recomendamos: {dailyExerciseTitle ?? "Ejercicio recomendado de movilidad"}. Mantén tu racha activa.
                </Text>
                <TouchableOpacity
                  style={[styles.modalPrimaryButton, { backgroundColor: palette.primary }]}
                  onPress={handleGoToDailyExercise}
                >
                  <Text style={[styles.modalPrimaryText, { color: colors.text }]}>Ir al ejercicio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSecondaryButton, { borderColor: palette.deepTeal }]}
                  onPress={() => setNotificationsVisible(false)}
                >
                  <Text style={[styles.modalSecondaryText, { color: palette.deepTeal }]}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ProgressRing({ progress, size, strokeWidth, strokeColor, children }) {
  const safeProgress = Math.max(0, Math.min(1, progress ?? 0));
  const innerSize = Math.max(0, size - strokeWidth * 2);
  const filledSize = innerSize * safeProgress;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: "rgba(255,255,255,0.35)",
          backgroundColor: "rgba(255,255,255,0.08)",
        }}
      />

      <View
        style={{
          position: "absolute",
          width: filledSize,
          height: filledSize,
          borderRadius: filledSize / 2,
          backgroundColor: strokeColor,
          opacity: 0.85,
        }}
      />
      <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerWrapper: {
    paddingHorizontal: 20,
  },
  headerGradient: {
    borderRadius: 24,
    padding: 18,
    marginTop: 12,
    overflow: "hidden",
  },
  headerBackground: {
    opacity: 0.96,
  },
  headerContent: {
    gap: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  greetingRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "900",
    fontSize: 18,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  iconButtonText: {
    fontSize: 18,
    fontWeight: "800",
  },
  headerGreeting: {
    fontSize: 28,
    fontWeight: "900",
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  headerStatus: {
    fontSize: 13,
    fontWeight: "600",
  },
  contentArea: {
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 14,
  },
  summarySection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryIcon: {
    fontSize: 18,
  },
  sectionEyebrow: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  sessionCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  sessionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 13,
    fontWeight: "600",
  },
  durationRow: {
    flexDirection: "row",
    gap: 10,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "800",
  },
  primaryButton: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  secondaryButtonText: {
    fontWeight: "800",
    fontSize: 14,
  },
  challengeCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeIcon: {
    fontSize: 22,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  carouselCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  carouselHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lightbulb: {
    fontSize: 20,
  },
  tipCard: {
    padding: 14,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    gap: 6,
  },
  tipIndex: {
    fontSize: 13,
    fontWeight: "700",
  },
  tipText: {
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  snackbar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 8,
  },
  snackbarText: {
    fontWeight: "800",
    fontSize: 14,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  miniMotivation: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalBody: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalPrimaryButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalPrimaryText: {
    fontWeight: "800",
    fontSize: 15,
  },
  modalSecondaryButton: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  modalSecondaryText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
