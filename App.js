import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Video } from "expo-av";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeProvider } from "./src/themeContext";
import ExercisesScreen from "./src/screens/ExercisesScreen";

export default function App() {
  const [screen, setScreen] = useState("intro");

  const renderIntro = () => (
    <View style={styles.videoContainer}>
      <StatusBar style="light" />
      <Video
        source={require("./assets/intro.mp4")}
        style={styles.video}
        shouldPlay
        isLooping={false}
        resizeMode="contain"
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            setScreen("home");
          }
        }}
      />
      <TouchableOpacity style={styles.skipButton} onPress={() => setScreen("home")}>
        <Text style={styles.skipButtonText}>Omitir</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHome = () => (
    <View style={styles.heroContainer}>
      <StatusBar style="light" />
      <View style={styles.heroContent}>
        <Image source={require("./assets/splash-icon.png")} style={styles.logo} />
        <Text style={styles.title}>Bienvenido a PosturaU</Text>
        <Text style={styles.subtitle}>
          Mejora tu bienestar postural con rutinas guiadas, seguimiento de progreso y consejos prácticos.
        </Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("exercises")}>
        <Text style={styles.primaryButtonText}>Ver ejercicios</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExercises = () => (
    <View style={styles.exercisesContainer}>
      <StatusBar style="dark" />
      <ExercisesScreen />
      <TouchableOpacity style={styles.skipButton} onPress={() => setScreen("home")}>
        <Text style={styles.skipButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemeProvider>
      {screen === "intro" && renderIntro()}
      {screen === "home" && renderHome()}
      {screen === "exercises" && renderExercises()}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: "#0B5563",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  video: {
    width: "100%",
    height: "80%",
    borderRadius: 16,
    overflow: "hidden",
  },
  heroContainer: {
    flex: 1,
    backgroundColor: "#0B5563",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#E8F1F2",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  primaryButton: {
    marginHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F4A261",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#0B1D26",
    fontWeight: "700",
    fontSize: 16,
  },
  skipButton: {
    position: "absolute",
    bottom: 32,
    right: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  skipButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  exercisesContainer: {
    flex: 1,
    position: "relative",
  },
});
