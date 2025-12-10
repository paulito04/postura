import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import FavoritesButton from "./FavoritesButton";

export default function LearningCard({ item, onPress, onToggleFavorite }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 20 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{item.icon || "📘"}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{item.readTime}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>{item.level}</Text>
          </View>
        </View>
      </Pressable>

      <FavoritesButton
        isActive={item.favorite}
        onPress={onToggleFavorite}
        label={item.favorite ? "En favoritos" : "Guardar"}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pressable: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  description: {
    fontSize: 13,
    color: "#4B5563",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  meta: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  dot: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
