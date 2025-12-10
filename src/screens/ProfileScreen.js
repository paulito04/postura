import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../themeContext";

const profile = {
  name: "María Postura",
  email: "maria@posturau.app",
  goal: "Mejorar la higiene postural en jornada de oficina",
};

export default function ProfileScreen({ LoginCardComponent, userName, setUserName, isLoggedIn, setIsLoggedIn }) {
  const { colors } = useAppTheme();
  const currentName = isLoggedIn && userName ? userName : "Sin iniciar sesión";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {LoginCardComponent ? (
          <LoginCardComponent
            userName={userName}
            setUserName={setUserName}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        ) : null}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Perfil</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{currentName}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Correo</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{profile.email}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Objetivo</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{profile.goal}</Text>
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
});
