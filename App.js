import React from "react";
import { StatusBar } from "expo-status-bar";
import { BottomTabs } from "./src/navigation/BottomTabs";
import { ThemeProvider } from "./src/themeContext";

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <BottomTabs />
    </ThemeProvider>
  );
}
