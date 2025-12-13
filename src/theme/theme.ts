export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    card: string;
    cardAlt: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    accentSoft: string;
    primaryText: string;
    secondaryText: string;
    text: string;
    textMuted: string;
    border: string;
    borderSoft: string;
    danger: string;
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
};

export const lightColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  primaryText: '#111827',
  secondaryText: '#6B7280',
  primary: '#0FB4BD',
  primaryDark: '#0A8F95',
  accent: '#DD7631',
  accentSoft: '#FCD3AA',
  borderSoft: '#E5E7EB',
};

export const darkColors = {
  background: '#020617',
  surface: '#0B1120',
  card: '#111827',
  cardAlt: '#1F2937',
  primaryText: '#F9FAFB',
  secondaryText: '#9CA3AF',
  primary: '#55D1D6',
  accent: '#DD7631',
  accentSoft: '#4B5563',
  borderSoft: '#1F2937',
};

export const lightTheme: AppTheme = {
  colors: {
    background: lightColors.background,
    surface: lightColors.surface,
    card: lightColors.surface,
    cardAlt: lightColors.surface,
    primary: lightColors.primary,
    primaryDark: lightColors.primaryDark,
    secondary: lightColors.primaryDark,
    accent: lightColors.accent,
    accentSoft: lightColors.accentSoft,
    primaryText: lightColors.primaryText,
    secondaryText: lightColors.secondaryText,
    text: lightColors.primaryText,
    textMuted: lightColors.secondaryText,
    border: lightColors.borderSoft,
    borderSoft: lightColors.borderSoft,
    danger: '#DC2626',
    tabBarBackground: lightColors.surface,
    tabBarActive: lightColors.primary,
    tabBarInactive: lightColors.secondaryText,
  },
};

export const darkTheme: AppTheme = {
  colors: {
    background: darkColors.background,
    surface: darkColors.surface,
    card: darkColors.card,
    cardAlt: darkColors.cardAlt,
    primary: darkColors.primary,
    primaryDark: darkColors.primary,
    secondary: darkColors.primary,
    accent: darkColors.accent,
    accentSoft: darkColors.accentSoft,
    primaryText: darkColors.primaryText,
    secondaryText: darkColors.secondaryText,
    text: darkColors.primaryText,
    textMuted: darkColors.secondaryText,
    border: darkColors.borderSoft,
    borderSoft: darkColors.borderSoft,
    danger: darkColors.accent,
    tabBarBackground: darkColors.surface,
    tabBarActive: darkColors.primary,
    tabBarInactive: darkColors.secondaryText,
  },
};
