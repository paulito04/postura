import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from './theme';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

const navigationLib = (() => {
  try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    return require('@react-navigation/native');
  } catch (error) {
    console.warn('Navigation library not available, falling back to basic container');
    return null;
  }
})();

const NavigationContainer = navigationLib?.NavigationContainer ?? (({ children }: { children: React.ReactNode }) => <>{children}</>);
const DefaultTheme = navigationLib?.DefaultTheme ?? { colors: {} };
const DarkTheme = navigationLib?.DarkTheme ?? { colors: {} };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = '@moveup_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
          setModeState(saved);
        }
      } catch (e) {
        console.warn('Error loading theme mode', e);
      }
    })();
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  };

  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : 'light');

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemedNavigationContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, mode } = useTheme();

  const navTheme = useMemo(
    () => ({
      ...(mode === 'dark' ? DarkTheme : DefaultTheme),
      colors: {
        ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
        background: theme.colors.background,
        card: theme.colors.tabBarBackground,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.primary,
      },
    }),
    [mode, theme.colors.background, theme.colors.border, theme.colors.primary, theme.colors.tabBarBackground, theme.colors.text]
  );

  return <NavigationContainer theme={navTheme}>{children}</NavigationContainer>;
};
