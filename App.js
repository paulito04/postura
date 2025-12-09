import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomTabs } from "./src/navigation/BottomTabs";
import { ThemeProvider } from "./src/themeContext";

export default function App() {
  const [screen, setScreen] = useState("intro");

  return (
    <ThemeProvider>
      {screen === "intro" ? (
        <View style={styles.videoContainer}>
          <StatusBar style="light" />
          <View style={styles.heroContent}>
            <Image source={require("./assets/splash-icon.png")} style={styles.logo} />
            <Text style={styles.title}>Bienvenido a PosturaU</Text>
            <Text style={styles.subtitle}>
              Mejora tu bienestar postural con rutinas guiadas, seguimiento de progreso y
              consejos prácticos.
            </Text>
          </View>
          <TouchableOpacity style={styles.skipButton} onPress={() => setScreen("home")}>
            <Text style={styles.skipButtonText}>Omitir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <StatusBar style="dark" />
          <BottomTabs />
        </>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: "#0B5563",
    justifyContent: "center",
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
});
