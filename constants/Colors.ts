/**
 * Professional color scheme inspired by modern banking apps
 * Clean, trustworthy, and accessible design
 */

const primaryGreen = '#00C851';
const primaryGreenDark = '#00A843';
const secondaryBlue = '#2196F3';
const accentOrange = '#FF9800';
const successGreen = '#4CAF50';
const warningOrange = '#FF9800';
const errorRed = '#F44336';

const gray50 = '#FAFAFA';
const gray100 = '#F5F5F5';
const gray200 = '#EEEEEE';
const gray300 = '#E0E0E0';
const gray400 = '#BDBDBD';
const gray500 = '#9E9E9E';
const gray600 = '#757575';
const gray700 = '#616161';
const gray800 = '#424242';
const gray900 = '#212121';

const tintColorLight = primaryGreen;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    background: '#FFFFFF',
    backgroundSecondary: gray50,
    backgroundTertiary: gray100,
    tint: tintColorLight,
    icon: gray600,
    tabIconDefault: gray500,
    tabIconSelected: tintColorLight,
    primary: primaryGreen,
    primaryDark: primaryGreenDark,
    secondary: secondaryBlue,
    accent: accentOrange,
    success: successGreen,
    warning: warningOrange,
    error: errorRed,
    card: '#FFFFFF',
    cardBorder: gray200,
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2D2D2D',
    tint: tintColorDark,
    icon: '#B0B0B0',
    tabIconDefault: '#808080',
    tabIconSelected: tintColorDark,
    primary: primaryGreen,
    primaryDark: primaryGreenDark,
    secondary: secondaryBlue,
    accent: accentOrange,
    success: successGreen,
    warning: warningOrange,
    error: errorRed,
    card: '#1E1E1E',
    cardBorder: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};
