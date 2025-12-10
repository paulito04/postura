import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SectionHeader({ title, accentColor = "#3B82F6" }) {
  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: accentColor }]} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 6,
    gap: 8,
  },
  indicator: {
    width: 6,
    height: 20,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
});
