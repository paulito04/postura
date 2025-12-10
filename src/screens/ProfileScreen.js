import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../themeContext";

const profile = {
  name: "María Postura",
  email: "maria@posturau.app",
  goal: "Mejorar la higiene postural en jornada de oficina",
};

export default function ProfileScreen({ user, isLoggedIn, setIsLoggedIn }) {
  const { colors } = useAppTheme();
  const currentName = isLoggedIn && user?.name ? user.name : "Sin iniciar sesión";
  const currentEmail = isLoggedIn && user?.email ? user.email : profile.email;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Perfil</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{currentName}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Correo</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{currentEmail}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Objetivo</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{profile.goal}</Text>

          <TouchableOpacity
            style={[styles.switchButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => setIsLoggedIn(false)}
          >
            <Text style={[styles.switchButtonText, { color: colors.primary }]}>Cambiar cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
  },
  switchButton: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
});
