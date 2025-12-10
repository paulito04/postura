import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ExercisesScreen from "../screens/ExercisesScreen";
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProgressScreen from "../screens/ProgressScreen";
import { useAppTheme } from "../themeContext";

const tabs = [
  { key: "Inicio", icon: "home", component: HomeScreen },
  { key: "Ejercicios", icon: "🏋️", component: ExercisesScreen },
  { key: "Progreso", icon: "📈", component: ProgressScreen },
  { key: "Aprender", icon: "📚", component: LearnScreen },
  { key: "Perfil", icon: "👤", component: ProfileScreen },
];

export default function MainTabs({ userName }) {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const navigation = useMemo(
    () => ({
      navigate: (screenName) => {
        const exists = tabs.some((tab) => tab.key === screenName);
        if (exists) {
          setActiveTab(screenName);
        }
      },
    }),
    []
  );

  const ActiveComponent = useMemo(
    () => tabs.find((tab) => tab.key === activeTab)?.component ?? HomeScreen,
    [activeTab]
  );

  const handleSelectTab = useCallback((tabKey) => setActiveTab(tabKey), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.screenContainer}>
        <ActiveComponent navigation={navigation} userName={userName} />
      </View>

      <View style={[styles.tabBar, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const color = isActive ? colors.primary : colors.textSecondary;

          return (
            <TouchableOpacity
              key={tab.key}
              accessibilityRole="button"
              accessibilityState={isActive ? { selected: true } : undefined}
              onPress={() => handleSelectTab(tab.key)}
              style={styles.tabButton}
            >
              {tab.icon === "home" ? (
                <HomeIcon active={isActive} />
              ) : (
                <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              )}
              <Text style={[styles.tabLabel, { color }]}>{tab.key}</Text>
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
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    alignItems: "center",
    gap: 4,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});

function HomeIcon({ active }) {
  return (
    <View style={[homeIconStyles.wrapper, active && homeIconStyles.active]}>
      <View style={homeIconStyles.houseBase}>
        <View style={homeIconStyles.door} />
        <View style={homeIconStyles.window} />
      </View>
      <View style={homeIconStyles.roof} />
    </View>
  );
}

const homeIconStyles = StyleSheet.create({
  wrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#437118",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    borderWidth: 2,
    borderColor: "#1D2A62",
  },
  houseBase: {
    position: "absolute",
    bottom: 4,
    width: 21,
    height: 14,
    backgroundColor: "#F5F3D8",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  door: {
    width: 7,
    height: 9,
    backgroundColor: "#437118",
    borderRadius: 2,
    marginBottom: 2,
  },
  window: {
    position: "absolute",
    right: 4,
    top: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#437118",
  },
  roof: {
    position: "absolute",
    top: 6,
    width: 18,
    height: 18,
    backgroundColor: "#F5F3D8",
    transform: [{ rotate: "45deg" }],
    borderRadius: 4,
  },
});
