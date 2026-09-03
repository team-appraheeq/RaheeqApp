import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { LOGOS, FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const AppHeader = ({ title, showBack = false, onBack }) => {
  const { userProfile, settings, theme, toggleTheme, activeSubScreen, navigateTo, activeTab } = useApp();

  const isDarkMode = settings.isDarkMode;
  const currentLogo = isDarkMode ? LOGOS.logo4 : LOGOS.logo3;
  const isMale = userProfile?.gender === 'male';
  const avatarBgColor = isMale ? COLORS.maleBlue : COLORS.femalePink;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (activeSubScreen) {
      navigateTo(activeTab, null);
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.headerBg, borderBottomColor: theme.divider }]}>
      {/* Right side (RTL Start): Logo and title */}
      <View style={styles.rightSection}>
        {showBack || activeSubScreen ? (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f4f0' }]}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        ) : null}

        <Image source={currentLogo} style={styles.logoImage} resizeMode="contain" />

        {title ? (
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{title}</Text>
        ) : (
          <View style={styles.greetingBox}>
            <Text style={[styles.greetingSmall, { color: theme.textSecondary }]}>مرحباً بك،</Text>
            <Text style={[styles.userName, { color: theme.textPrimary }]} numberOfLines={1}>
              {userProfile?.name || 'ضيف رحيق'}
            </Text>
          </View>
        )}
      </View>

      {/* Left side: Avatar & Theme toggle */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={[styles.themeToggleButton, { backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f4f0' }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={18}
            color={isDarkMode ? COLORS.yellowGold : COLORS.greyDark}
          />
        </TouchableOpacity>

        {userProfile && (
          <View style={[styles.avatarCircle, { backgroundColor: avatarBgColor }]}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row-reverse', // RTL Layout
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  rightSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  logoImage: {
    width: 44,
    height: 44,
    marginLeft: 10,
  },
  greetingBox: {
    alignItems: 'flex-end',
    flex: 1,
  },
  greetingSmall: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 14,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  pageTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginRight: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarIcon: {
    fontSize: 18,
  },
});
