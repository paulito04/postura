export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textMuted: string;
    border: string;
    card: string;
    danger: string;
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
};

export const lightTheme: AppTheme = {
  colors: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    primary: '#055F67',
    secondary: '#9EB998',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    danger: '#DC2626',
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#055F67',
    tabBarInactive: '#9CA3AF',
  },
};

export const darkTheme: AppTheme = {
  colors: {
    background: '#000000',
    surface: '#220C12',
    card: '#220C12',
    primary: '#9F0A10',
    secondary: '#C1914F',
    text: '#EBE0C2',
    textMuted: '#C1914F',
    border: '#430102',
    danger: '#9F0A10',
    tabBarBackground: '#000000',
    tabBarActive: '#EBE0C2',
    tabBarInactive: '#6B7280',
  },
};
