import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StatusBar } from "expo-status-bar";

WebBrowser.maybeCompleteAuthSession();

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

  const clientIds = useMemo(
    () => ({
      expoClientId:
        process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ||
        "YOUR_EXPO_GOOGLE_CLIENT_ID",
      androidClientId:
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
        "YOUR_ANDROID_CLIENT_ID",
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
        "YOUR_WEB_CLIENT_ID",
    }),
    []
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    scopes: ["openid", "profile", "email"],
    ...clientIds,
  });

  useEffect(() => {
    const authenticate = async () => {
      if (response?.type === "success") {
        setIsLoading(true);
        try {
          const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
            }
          );

          if (!userInfoResponse.ok) {
            throw new Error("No se pudo obtener la información del perfil");
          }

          const profile = await userInfoResponse.json();
          setUser({
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
          });
        } catch (error) {
          console.warn("Error al autenticar con Google", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    authenticate();
  }, [response]);

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
    promptAsync({ showInRecents: true, useProxy: true });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const hasClientIdsConfigured = useMemo(
    () =>
      clientIds.expoClientId !== "YOUR_EXPO_GOOGLE_CLIENT_ID" &&
      clientIds.androidClientId !== "YOUR_ANDROID_CLIENT_ID" &&
      clientIds.webClientId !== "YOUR_WEB_CLIENT_ID",
    [clientIds]
  );

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
            Conéctate con Google para guardar tu progreso y personalizar tus
            ejercicios.
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
                !hasClientIdsConfigured && { backgroundColor: "rgba(15,155,168,0.45)" },
              ]}
              onPress={handleLogin}
              disabled={!request || isLoading || !hasClientIdsConfigured}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.buttonText, { color: theme.colors.surface }]}>
                  {hasClientIdsConfigured
                    ? "Iniciar sesión con Google"
                    : "Configura tus credenciales de Google"}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {!hasClientIdsConfigured && (
            <Text style={[styles.helperText, { color: theme.colors.warning }]}>
              Añade tus IDs de cliente a variables de entorno públicas (por ejemplo,
              EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) para habilitar el inicio de sesión.
              Consulta las instrucciones del README de tu proyecto de Google Cloud.
            </Text>
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
