import React, { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { Video } from "expo-av";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IntroScreen({ onFinish }) {
  const handleFinish = useCallback(() => {
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  return (
    <View style={styles.videoContainer}>
      <StatusBar style="light" />
      <Video
        source={require("../../assets/intro.mp4")}
        style={[styles.video, StyleSheet.absoluteFill]}
        shouldPlay
        isLooping={false}
        resizeMode="cover"
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            handleFinish();
          }
        }}
      />
      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={styles.skipButtonText}>Omitir</Text>
      </TouchableOpacity>
    </View>
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
