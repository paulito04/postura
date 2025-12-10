import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ExercisesScreen from "../screens/ExercisesScreen";
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProgressScreen from "../screens/ProgressScreen";
import { useAppTheme } from "../themeContext";

const tabs = [
  { key: "Inicio", icon: "🏠", component: HomeScreen },
  { key: "Ejercicios", icon: "🏋️", component: ExercisesScreen },
  { key: "Progreso", icon: "📈", component: ProgressScreen },
  { key: "Aprender", icon: "📚", component: LearnScreen },
  { key: "Perfil", icon: "👤", component: ProfileScreen },
];

export default function MainTabs({ user, userName, isLoggedIn, setIsLoggedIn, setUser, onLogin, LoginCardComponent }) {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [tabParams, setTabParams] = useState({});

  const navigation = useMemo(
    () => ({
      navigate: (screenName, params = {}) => {
        const exists = tabs.some((tab) => tab.key === screenName);
        if (exists) {
          setActiveTab(screenName);
          setTabParams((prev) => ({ ...prev, [screenName]: params }));
        }
      },
    }),
    []
  );

  const ActiveComponent = useMemo(
    () => tabs.find((tab) => tab.key === activeTab)?.component ?? HomeScreen,
    [activeTab]
  );
  const activeProps = tabParams[activeTab];

  const handleSelectTab = (tabKey) => {
    if (!isLoggedIn) return;
    setActiveTab(tabKey);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.screenContainer}>
        <ActiveComponent
          navigation={navigation}
          user={user}
          userName={userName}
          tabParams={activeProps}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
        />
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
              style={[
                styles.tabButton,
                isActive && { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color, fontWeight: isActive ? "800" : "600" }]}>{tab.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!isLoggedIn && LoginCardComponent ? (
        <View style={styles.loginOverlay} pointerEvents="auto">
          <LoginCardComponent user={user} onLogin={onLogin} />
        </View>
      ) : null}
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
    paddingHorizontal: 10,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  loginOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
