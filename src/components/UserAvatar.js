import React, { useRef } from "react";
import { View, Image, StyleSheet } from "react-native";

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
 */

/**
 * Muestra un avatar circular con una corona aleatoria para usuarios premium.
 * La corona se elige una vez por sesión usando useRef para mantener el índice.
 *
 * @param {Props} props
 */
export default function UserAvatar({ photoUri, isPremium }) {
  // Elegimos UNA corona aleatoria por sesión (no cambia en cada render)
  const crownIndexRef = useRef(null);

  if (crownIndexRef.current === null) {
    crownIndexRef.current = Math.floor(Math.random() * crowns.length);
  }

  const crownSource = isPremium ? crowns[crownIndexRef.current] : null;

  const avatarSource = photoUri ? { uri: photoUri } : fallbackAvatar;

  return (
    <View style={styles.container}>
      {/* Foto de perfil circular */}
      <Image source={avatarSource} style={styles.avatar} />

      {/* Corona pegada al borde superior de la foto */}
      {crownSource && <Image source={crownSource} style={styles.crown} />}
    </View>
  );
}

const AVATAR_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE + 16, // un poquito más alto para que quepa la corona
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: "#055F67", // color del marco, cámbialo si quieres
    backgroundColor: "#fff",
  },
  crown: {
    position: "absolute",
    top: -8, // se ve justo sobre el perímetro
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
