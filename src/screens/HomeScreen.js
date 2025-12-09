import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../themeContext";

export default function HomeScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Inicio</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>Bienvenido a tu app de bienestar postural. Explora tus ejercicios, aprende buenas prácticas y sigue tu progreso diario.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
