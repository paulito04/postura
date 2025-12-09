import React, { createContext, useContext, useMemo } from "react";
import { theme } from "./theme";

const ThemeContext = createContext(theme);

export function ThemeProvider({ children }) {
  const value = useMemo(() => theme, []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
