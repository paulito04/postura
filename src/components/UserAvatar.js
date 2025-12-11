import React from "react";
import { View, Image, StyleSheet } from "react-native";

// Coronitas (los .png ya existen en el proyecto, no los crees aquí)
const CROWN_FRAMES = [
  require("../../assets/profile/crowns/crown1.png"),
  require("../../assets/profile/crowns/crown2.png"),
  require("../../assets/profile/crowns/crown3.png"),
  require("../../assets/profile/crowns/crown4.png"),
  require("../../assets/profile/crowns/crown5.png"),
  require("../../assets/profile/crowns/crown6.png"),
];

// 🔹 Índice aleatorio de corona por sesión
// Se calcula una sola vez cuando se carga este módulo
const SESSION_CROWN_INDEX = Math.floor(
  Math.random() * CROWN_FRAMES.length
);

export default function UserAvatar({
  photoUri,
  size = 80,
  isPro = false,
}) {
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
      ]}
    >
      {/* FOTO DE PERFIL */}
      <Image
        source={
          photoUri
            ? { uri: photoUri }
            : require("../../assets/default-avatar.png")
        }
        style={[
          styles.avatar,
          { borderRadius: borderRadius * 0.9 },
        ]}
        resizeMode="cover"
      />

      {/* CORONA COMO MARCO, SOLO PRO */}
      {isPro && (
        <Image
          source={CROWN_FRAMES[SESSION_CROWN_INDEX]}
          style={[
            styles.crown,
            { borderRadius },
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "78%", // la foto va un poco más pequeña
    height: "78%", // para que la corona la rodee
  },
  crown: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
});
