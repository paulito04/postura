import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import ProgressScreen from "../screens/ProgressScreen";
import LearnScreen from "../screens/LearnScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAppTheme } from "../themeContext";

const Tab = createBottomTabNavigator();

const tabIcons = {
  Inicio: "🏠",
  Ejercicios: "🏋️",
  Progreso: "📈",
  Aprender: "📚",
  Perfil: "👤",
};

export default function MainTabs() {
  const { colors } = useAppTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>{tabIcons[route.name]}</Text>
          ),
          tabBarLabelStyle: { fontSize: 12 },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Ejercicios" component={ExercisesScreen} />
        <Tab.Screen name="Progreso" component={ProgressScreen} />
        <Tab.Screen name="Aprender" component={LearnScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

