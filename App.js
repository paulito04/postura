import "react-native-gesture-handler";
import React, { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Video } from "expo-av";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeProvider } from "./src/themeContext";
import MainTabs from "./src/navigation/MainTabs";

export default function App() {
  const [screen, setScreen] = useState("intro");

  const handleFinishIntro = useCallback(() => {
    setScreen("main");
  }, []);

  return (
    <ThemeProvider>
      {screen === "intro" ? (
        <View style={styles.videoContainer}>
          <StatusBar style="light" />
          <Video
            source={require("./assets/intro.mp4")}
            style={[styles.video, StyleSheet.absoluteFill]}
            shouldPlay
            isLooping={false}
            resizeMode="cover"
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                handleFinishIntro();
              }
            }}
          />
          <TouchableOpacity style={styles.skipButton} onPress={handleFinishIntro}>
            <Text style={styles.skipButtonText}>Omitir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MainTabs />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: "#003b46",
  },
  video: {
    backgroundColor: "transparent",
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
