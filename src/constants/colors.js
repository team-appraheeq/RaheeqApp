export const COLORS = {
  // Brand Palette from colors.txt
  greenDark: '#127019',
  greenLight: '#17a31d',
  yellowLight: '#eaf95d',
  yellowGold: '#dddd12',
  white: '#ffffff',
  greyLight: '#afacac',
  greyDark: '#444444',
  black: '#1a1a1a',

  // Gender colors
  maleBlue: '#2563EB',
  femalePink: '#DB2777',

  // Semantic mappings
  success: '#17a31d',
  gold: '#dddd12',
};

export const getTheme = (isDark = false) => {
  if (isDark) {
    return {
      isDark: true,
      background: '#121212',
      surface: '#1a1a1a',
      surfaceElevated: '#242424',
      cardBg: '#1f2421',
      cardBorder: '#2d3748',
      textPrimary: '#ffffff',
      textSecondary: '#afacac',
      textMuted: '#888888',
      primary: '#17a31d',
      primaryDark: '#127019',
      accent: '#dddd12',
      accentLight: '#eaf95d',
      border: '#333333',
      headerBg: '#1a1a1a',
      tabBarBg: '#181818',
      tabBarActive: '#17a31d',
      tabBarInactive: '#afacac',
      inputBg: '#252525',
      inputBorder: '#3d3d3d',
      shadow: '#000000',
      badgeBg: 'rgba(23, 163, 29, 0.2)',
      badgeText: '#eaf95d',
      divider: '#2b2b2b',
    };
  }

  return {
    isDark: false,
    background: '#f4f7f4',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    textPrimary: '#1a1a1a',
    textSecondary: '#444444',
    textMuted: '#afacac',
    primary: '#127019',
    primaryDark: '#0e5213',
    accent: '#17a31d',
    accentLight: '#eaf95d',
    gold: '#dddd12',
    border: '#e0e0e0',
    headerBg: '#ffffff',
    tabBarBg: '#ffffff',
    tabBarActive: '#127019',
    tabBarInactive: '#afacac',
    inputBg: '#f9fbf9',
    inputBorder: '#d1d5db',
    shadow: '#000000',
    badgeBg: 'rgba(18, 112, 25, 0.12)',
    badgeText: '#127019',
    divider: '#eeeeee',
  };
};
