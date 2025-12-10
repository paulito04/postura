import React from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../themeContext";

export default function HomeScreen({ navigation }) {
  const { colors } = useAppTheme();

  const handleExercisesPress = () => {
    if (navigation?.navigate) {
      navigation.navigate("Ejercicios");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryDark }]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Image source={require("../../assets/splash-icon.png")} style={styles.logo} />
        <Text style={styles.title}>Bienvenido a PosturaU</Text>
        <Text style={styles.subtitle}>
          Mejora tu bienestar postural con rutinas guiadas, seguimiento de progreso y consejos prácticos.
        </Text>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={handleExercisesPress}
        >
          <Text style={styles.primaryButtonText}>Ver ejercicios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 32,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#E8F1F2",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#0B1D26",
    fontWeight: "700",
    fontSize: 16,
  },
});
