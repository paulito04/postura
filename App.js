import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [showExercises, setShowExercises] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [valuePropText] = useState("Mejora tu postura mientras estudias");
  const [loadingMessage] = useState("Preparando tu rutina de hoy...");
  const [brandLine] = useState("Move Up · Postura · Pausas activas · Bienestar");

  const theme = useMemo(
    () => ({
      colors: {
        primary: "#0F9BA8",
        primaryDark: "#0B5563",
        accent: "#FF6B4A",
        wellness: "#7AC9A6",
        background: "#F5F7FA",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        textPrimary: "#1F2933",
        textSecondary: "#6B7280",
        success: "#22C55E",
        warning: "#FBBF24",
        error: "#EF4444",
      },
    }),
    []
  );

  const demoProfile = useMemo(
    () => ({
      name: "Sesión de prueba",
      email: "demo@posturau.app",
    }),
    []
  );

  const exercises = [
    "Estiramiento de cuello lateral",
    "Puente de glúteos",
    "Plancha abdominal",
    "Gato-vaca en cuatro puntos",
    "Apertura de pecho en pared",
  ];

  const handlePress = () => {
    setShowExercises(true);
  };

  const handleBack = () => {
    setShowExercises(false);
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(demoProfile);
      setIsLoading(false);
    }, 650);
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (!isSplashVisible) return;

    setProgress(0);

    const timer = setInterval(() => {
      setProgress((current) => {
        const nextValue = Math.min(current + 12, 100);

        if (nextValue >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsSplashVisible(false), 420);
        }

        return nextValue;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [isSplashVisible]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" />
    {isSplashVisible ? (
      <View style={styles.splashWrapper}>
        <View style={styles.topSection}>
          <View style={[styles.logoBadge, { backgroundColor: theme.colors.surface }]}>
            <Image
              source={require("./assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.splashTitle, { color: theme.colors.textPrimary }]}>Move Up</Text>
          <Text style={[styles.splashSubtitle, { color: theme.colors.textSecondary }]}>{valuePropText}</Text>
        </View>

        <View style={styles.graphicWrapper}>
          <View style={[styles.graphicCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.gridOverlay}>
              {Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={`v-${index}`}
                  style={[styles.gridLine, styles.verticalLine, { left: `${((index + 1) / 7) * 100}%` }]}
                />
              ))}
              {Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={`h-${index}`}
                  style={[styles.gridLine, styles.horizontalLine, { top: `${((index + 1) / 7) * 100}%` }]}
                />
              ))}
            </View>

            <View style={styles.targetWrapper}>
              <View style={[styles.ring, styles.ringLarge, { borderColor: theme.colors.border }]} />
              <View style={[styles.ring, styles.ringMedium, { borderColor: theme.colors.border }]} />
              <View style={[styles.ring, styles.ringSmall, { borderColor: theme.colors.primary }]} />
              <View style={[styles.ring, styles.ringTiny, { borderColor: theme.colors.primary }]} />
              <View style={[styles.centerDot, { backgroundColor: theme.colors.primary }]} />
            </View>

            <View style={styles.cursor}>
              <View style={[styles.cursorStem, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.cursorHead, { backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            {loadingMessage}
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={[styles.percentText, { color: theme.colors.textSecondary }]}>{`${progress}%`}</Text>
        </View>

        <Text style={[styles.brandLine, { color: theme.colors.textSecondary }]}>{brandLine}</Text>
      </View>
    ) : showExercises ? (
        <View
          style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Ejercicios de postura</Text>
          {exercises.map((exercise) => (
            <Text key={exercise} style={[styles.listItem, { color: theme.colors.textPrimary }]}>
              • {exercise}
            </Text>
          ))}

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.background,
              },
            ]}
            onPress={handleBack}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Cuida tu postura</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Inicia sesión de prueba para simular el guardado de tu progreso y
            recibir recomendaciones personalizadas.
          </Text>

          {user ? (
            <View
              style={[
                styles.userCard,
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.userTitle, { color: theme.colors.primaryDark }]}>Sesión iniciada</Text>
              <Text style={[styles.userText, { color: theme.colors.textPrimary }]}>Nombre: {user.name}</Text>
              <Text style={[styles.userText, { color: theme.colors.textSecondary }]}>Correo: {user.email}</Text>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
                ]}
                onPress={handleLogout}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary },
                user && { backgroundColor: "rgba(15,155,168,0.45)" },
              ]}
              onPress={handleLogin}
              disabled={isLoading || Boolean(user)}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Iniciar sesión de prueba</Text>
            )}
          </TouchableOpacity>
        )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.accent }]}
            onPress={handlePress}
          >
            <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Ver ejercicios</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 24,
  },
  splashWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 52,
    paddingHorizontal: 28,
  },
  topSection: {
    alignItems: "center",
    gap: 14,
  },
  logoBadge: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B5563",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    padding: 16,
  },
  logoImage: {
    width: "78%",
    height: "78%",
  },
  splashTitle: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  splashSubtitle: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.9,
  },
  graphicWrapper: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  graphicCard: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B5563",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "#E5E7EB",
  },
  verticalLine: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  horizontalLine: {
    left: 0,
    right: 0,
    height: 1,
    width: "100%",
  },
  targetWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 190,
    height: 190,
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 999,
  },
  ringLarge: {
    width: 200,
    height: 200,
    opacity: 0.9,
  },
  ringMedium: {
    width: 140,
    height: 140,
    opacity: 0.9,
  },
  ringSmall: {
    width: 86,
    height: 86,
    borderWidth: 2,
    opacity: 0.9,
  },
  ringTiny: {
    width: 44,
    height: 44,
    borderWidth: 2,
    opacity: 0.9,
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  cursor: {
    position: "absolute",
    right: 60,
    bottom: 64,
    alignItems: "center",
  },
  cursorStem: {
    width: 6,
    height: 44,
    borderRadius: 12,
  },
  cursorHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginTop: 4,
  },
  progressSection: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  progressLabel: {
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  percentText: {
    fontSize: 14,
    textAlign: "center",
  },
  brandLine: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.82,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: "#0B5563",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    gap: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    paddingVertical: 4,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#0B5563",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  userCard: {
    padding: 14,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  userText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
