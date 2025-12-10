import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FavoritesButton({ isActive, onPress, label = "Añadir a favoritos" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isActive ? styles.buttonActive : styles.buttonInactive]}
      activeOpacity={0.9}
    >
      <Text style={[styles.icon, isActive ? styles.iconActive : styles.iconInactive]}>{isActive ? "★" : "☆"}</Text>
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  buttonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#1D4ED8",
  },
  buttonInactive: {
    backgroundColor: "#F5F5F5",
    borderColor: "#D4D4D8",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  labelActive: {
    color: "#FFFFFF",
  },
  labelInactive: {
    color: "#1F2937",
  },
  icon: {
    fontSize: 18,
  },
  iconActive: {
    color: "#FFFFFF",
  },
  iconInactive: {
    color: "#3B82F6",
  },
});
