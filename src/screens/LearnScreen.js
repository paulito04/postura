import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";

export default function LearnScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.title, { color: colors.textPrimary }]}>Aprender</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>Consejos rápidos:</Text>
        <View style={styles.list}>
          <Text style={[styles.item, { color: colors.textPrimary }]}>• Ajusta la altura de tu silla para que tus pies apoyen bien.</Text>
          <Text style={[styles.item, { color: colors.textPrimary }]}>• Descansa la vista cada 20 minutos alejando la mirada de la pantalla.</Text>
          <Text style={[styles.item, { color: colors.textPrimary }]}>• Activa el core al estar sentado para aliviar carga en la espalda.</Text>
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
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
  },
  list: {
    gap: 10,
  },
  item: {
    fontSize: 15,
    lineHeight: 21,
  },
});
