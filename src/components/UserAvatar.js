import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";

// Coronitas (no crear los .png, solo usarlos)
const CROWN_FRAMES = [
  require("../../assets/profile/crowns/crown1.png"),
  require("../../assets/profile/crowns/crown2.png"),
  require("../../assets/profile/crowns/crown3.png"),
  require("../../assets/profile/crowns/crown4.png"),
  require("../../assets/profile/crowns/crown5.png"),
  require("../../assets/profile/crowns/crown6.png"),
];

export default function UserAvatar({ photoUri, size = 80, isPro = false }) {
  const [crownIndex, setCrownIndex] = useState(0);

  useEffect(() => {
    if (isPro) {
      const idx = Math.floor(Math.random() * CROWN_FRAMES.length);
      setCrownIndex(idx);
    }
  }, [isPro]);

  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius },
      ]}
    >
      <Image
        source={photoUri ? { uri: photoUri } : require("../../assets/icon.png")}
        style={[styles.avatar, { borderRadius }]}
        resizeMode="cover"
      />

      {isPro && (
        <Image
          source={CROWN_FRAMES[crownIndex]}
          style={[styles.crown, { borderRadius }]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "80%",
    height: "80%",
  },
  crown: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    // Para que no interfiera con toques
    pointerEvents: "none",
  },
});
