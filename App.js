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
    <View style={styles.container}>
      <StatusBar style="dark" />
      {showExercises ? (
        <View style={styles.card}>
          <Text style={styles.title}>Ejercicios de postura</Text>
          {exercises.map((exercise) => (
            <Text key={exercise} style={styles.listItem}>
              • {exercise}
            </Text>
          ))}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
            <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Cuida tu postura</Text>
          <Text style={styles.subtitle}>
            Conéctate con Google para guardar tu progreso y personalizar tus
            ejercicios.
          </Text>

          {user ? (
            <View style={styles.userCard}>
              <Text style={styles.userTitle}>Sesión iniciada</Text>
              <Text style={styles.userText}>Nombre: {user.name}</Text>
              <Text style={styles.userText}>Correo: {user.email}</Text>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
                <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, !hasClientIdsConfigured && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={!request || isLoading || !hasClientIdsConfigured}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {hasClientIdsConfigured
                    ? "Iniciar sesión con Google"
                    : "Configura tus credenciales de Google"}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {!hasClientIdsConfigured && (
            <Text style={styles.helperText}>
              Añade tus IDs de cliente a variables de entorno públicas (por ejemplo,
              EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) para habilitar el inicio de sesión.
              Consulta las instrucciones del README de tu proyecto de Google Cloud.
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Ver ejercicios</Text>
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
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#4a90e2",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#8bb6e8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a90e2",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "bold",
  },
  helperText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  userCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f7f9fc",
    gap: 4,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  userText: {
    fontSize: 14,
  },
});
