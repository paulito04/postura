import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [showExercises, setShowExercises] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" />
      {showExercises ? (
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
