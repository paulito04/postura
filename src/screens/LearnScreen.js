import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../themeContext";

export default function LearnScreen({ LoginCardComponent, userName, setUserName, isLoggedIn, setIsLoggedIn }) {
  const { colors } = useAppTheme();

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
        <View style={[styles.card, { borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Consejos y contenido educativo (pendiente)</Text>
          <Text style={[styles.helper, { color: colors.textSecondary }]}>Pronto agregaremos guías y recursos para mejorar tu postura.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
  },
});
