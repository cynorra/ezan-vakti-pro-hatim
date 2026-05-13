export const Colors = {
  light: {
    primary: '#0A5C36',
    primaryDark: '#052F1C',
    primaryLight: '#14804D',
    secondary: '#1B4332',
    accent: '#D4AF37', // Gold
    accentLight: '#F4D03F',
    background: '#F0F4F2',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#052F1C',
    textSecondary: '#495057',
    textMuted: '#ADB5BD',
    border: '#E0E7E3',
    error: '#C0392B',
    success: '#27AE60',
    warning: '#F39C12',
    overlay: 'rgba(5, 47, 28, 0.4)',
    white: '#FFFFFF',
  },
  dark: {
    primary: '#14804D',
    primaryDark: '#052F1C',
    primaryLight: '#2ECC71',
    secondary: '#0A5C36',
    accent: '#D4AF37',
    accentLight: '#F4D03F',
    background: '#05100B',
    surface: '#0D1F16',
    card: '#0D1F16',
    text: '#E0E7E3',
    textSecondary: '#95D5B2',
    textMuted: '#52B788',
    border: '#1B4332',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F1C40F',
    overlay: 'rgba(0, 0, 0, 0.8)',
    white: '#FFFFFF',
  },
};

export const Gradients = {
  primary: ['#0A5C36', '#1B4332'],
  premium: ['#0A5C36', '#052F1C'],
  accent: ['#D4AF37', '#B8860B'],
  surface: ['#FFFFFF', '#F0F4F2'],
  darkSurface: ['#0D1F16', '#05100B'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 30,
  full: 9999,
};

export const Shadows = {
  none: {
    elevation: 0,
    shadowOpacity: 0,
  },
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  premium: {
    shadowColor: '#052F1C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 0,
  }
};
