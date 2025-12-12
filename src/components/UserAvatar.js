import React, { useRef } from "react";
import { View, Image, StyleSheet, Text } from "react-native";

// Usamos crown1 como imagen por defecto si no hay foto de usuario.
// Así evitamos requerir archivos que no existen.
const fallbackAvatar = require("../../assets/profile/crowns/crown1.png");

// Coronas que ya tienes en assets/profile/crowns
const crowns = [
  require("../../assets/profile/crowns/crown1.png"),
  require("../../assets/profile/crowns/crown2.png"),
  require("../../assets/profile/crowns/crown3.png"),
  require("../../assets/profile/crowns/crown4.png"),
  require("../../assets/profile/crowns/crown5.png"),
  require("../../assets/profile/crowns/crown6.png"),
];

/**
 * @typedef {Object} Props
 * @property {string | null} [photoUri] - foto real del usuario (opcional)
 * @property {boolean} [isPremium] - si es usuario premium o no
 * @property {string | null} [avatarColor] - color sólido para usar como avatar
 * @property {string} [name] - nombre para mostrar la inicial
 * @property {number} [size] - tamaño del avatar en px
 */

/**
 * Muestra un avatar circular con una corona aleatoria para usuarios premium.
 * La corona se elige una vez por sesión usando useRef para mantener el índice.
 *
 * @param {Props} props
 */
export default function UserAvatar({ photoUri, isPremium, avatarColor, name = "Usuario", size = AVATAR_SIZE }) {
  // Elegimos UNA corona aleatoria por sesión (no cambia en cada render)
  const crownIndexRef = useRef(null);

  if (crownIndexRef.current === null) {
    crownIndexRef.current = Math.floor(Math.random() * crowns.length);
  }

  const crownSource = isPremium ? crowns[crownIndexRef.current] : null;
  const avatarSize = size || AVATAR_SIZE;
  const containerStyle = [
    styles.container,
    { width: avatarSize, height: avatarSize + 16 },
  ];
  const avatarStyle = [
    styles.avatar,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
    },
  ];

  const initialLetter = name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const showInitialAvatar = !photoUri && avatarColor;

  return (
    <View style={containerStyle}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={avatarStyle} />
      ) : showInitialAvatar ? (
        <View
          style={[
            avatarStyle,
            {
              backgroundColor: avatarColor,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.avatarInitial, { fontSize: avatarSize * 0.38 }]}>
            {initialLetter}
          </Text>
        </View>
      ) : (
        <Image source={fallbackAvatar} style={avatarStyle} />
      )}

      {crownSource && (
        <Image
          source={crownSource}
          style={[
            styles.crown,
            { width: avatarSize * 0.5, height: avatarSize * 0.5 },
          ]}
        />
      )}
    </View>
  );
}

const AVATAR_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#055F67", // color del marco, cámbialo si quieres
    backgroundColor: "#fff",
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  crown: {
    position: "absolute",
    top: -8, // se ve justo sobre el perímetro
    resizeMode: "contain",
  },
});
