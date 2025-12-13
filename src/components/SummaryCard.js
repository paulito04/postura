import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  progress,
  onPress,
}) {
  const { theme, mode } = useTheme();
  const { colors } = theme;
  const isDarkMode = mode === "dark";
  const highlightColor = accentColor || colors.accent || colors.primary;
  const backgroundColor = isDarkMode ? colors.card : colors.surface;
  const titleColor = colors.primaryText;
  const subtitleColor = colors.secondaryText;
  const valueColor = highlightColor;
  const trackColor = colors.borderSoft || colors.border;
  const hasProgress = progress !== undefined && progress !== null;
  const clampedProgress = hasProgress ? Math.max(0, Math.min(1, progress)) : 0;
  const softAccent = `${highlightColor}20`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor,
          shadowColor: "#000",
          elevation: 5,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrapper, { backgroundColor: softAccent }]}>
          {icon}
        </View>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>

      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>

      {hasProgress ? (
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${clampedProgress * 100}%`,
                  backgroundColor: valueColor,
                },
              ]}
            />
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  value: {
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
});
