import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Video } from "expo-av";
import { BottomTabs } from "./src/navigation/BottomTabs";
import { ThemeProvider } from "./src/themeContext";

export default function App() {
  const videoRef = useRef(null);
  const [screen, setScreen] = useState("intro");

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setScreen("home");
    }
  };

  return (
    <ThemeProvider>
      {screen === "intro" ? (
        <View style={styles.videoContainer}>
          <StatusBar style="light" />
          <Video
            ref={videoRef}
            style={styles.video}
            source={require("./assets/intro.mp4")}
            resizeMode="cover"
            shouldPlay
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
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
    backgroundColor: "#000",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
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
