import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import ProgressScreen from "../screens/ProgressScreen";
import LearnScreen from "../screens/LearnScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAppTheme } from "../themeContext";

const tabs = [
  { name: "Inicio", icon: "🏠", component: HomeScreen },
  { name: "Ejercicios", icon: "🏋️", component: ExercisesScreen },
  { name: "Progreso", icon: "📈", component: ProgressScreen },
  { name: "Aprender", icon: "📚", component: LearnScreen },
  { name: "Perfil", icon: "👤", component: ProfileScreen },
];

export function BottomTabs() {
  const { colors } = useAppTheme();
  const [currentTab, setCurrentTab] = useState(tabs[0].name);

  const ActiveComponent = useMemo(() => {
    return tabs.find((tab) => tab.name === currentTab)?.component ?? HomeScreen;
  }, [currentTab]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ActiveComponent />
      </View>
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {tabs.map((tab) => {
          const isActive = tab.name === currentTab;
          const color = isActive ? colors.primary : colors.textSecondary;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => setCurrentTab(tab.name)}
            >
              <Text style={[styles.icon, { color }]}>{tab.icon}</Text>
              <Text style={[styles.label, { color }]}>{tab.name}</Text>
            </TouchableOpacity>
          );
        })}
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
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
