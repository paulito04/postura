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
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
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

  const handleTabPress = (tabName) => {
    if (!isLoggedIn) return;
    setActiveTab(tabName);
    if ((tabName === "Progreso" || tabName === "Aprender") && !isPremium) {
      setShowPaywall(true);
    }
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
          activeTabKey={activeTab.toLowerCase() === "progreso" ? "progress" : activeTab.toLowerCase()}
          isPremium={isPremium}
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
              onPress={() => handleTabPress(tab.key)}
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

      {LoginCardComponent ? (
        <LoginCardComponent visible={!isLoggedIn} user={user} onLogin={onLogin} />
      ) : null}

      {showPaywall && (
        <View style={styles.paywallOverlay} pointerEvents="auto">
          <View style={styles.paywallCard}>
            <Text style={styles.paywallTitle}>Desbloquea MoveUp Pro</Text>
            <Text style={styles.paywallPrice}>$9.99 / mes</Text>
            <Text style={styles.paywallSubtitle}>Obtén acceso completo a:</Text>
            <Text style={styles.paywallBullet}>• Panel de Progreso con estadísticas</Text>
            <Text style={styles.paywallBullet}>• Logros, insignias y recompensas</Text>
            <Text style={styles.paywallBullet}>• Módulo educativo "Aprender" con contenido ergonómico</Text>

            <TouchableOpacity
              style={styles.paywallPrimaryButton}
              onPress={() => {
                setIsPremium(true);
                setShowPaywall(false);
              }}
            >
              <Text style={styles.paywallPrimaryText}>Activar membresía</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paywallSecondaryButton}
              onPress={() => {
                setShowPaywall(false);
                setActiveTab("Inicio");
              }}
            >
              <Text style={styles.paywallSecondaryText}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  paywallOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 999,
  },
  paywallCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "flex-start",
  },
  paywallTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#055F67",
    marginBottom: 4,
  },
  paywallPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A393C",
    marginBottom: 8,
  },
  paywallSubtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  paywallBullet: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  paywallPrimaryButton: {
    width: "100%",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#055F67",
    alignItems: "center",
  },
  paywallPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  paywallSecondaryButton: {
    width: "100%",
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#055F67",
    alignItems: "center",
  },
  paywallSecondaryText: {
    color: "#055F67",
    fontSize: 14,
    fontWeight: "500",
  },
});
