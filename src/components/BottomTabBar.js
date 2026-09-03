import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

const TABS = [
  { id: 'home', title: 'الرئيسية', icon: 'home', iconOutline: 'home-outline' },
  { id: 'activities', title: 'الفعاليات', icon: 'grid', iconOutline: 'grid-outline' },
  { id: 'achievements', title: 'الإنجازات', icon: 'trophy', iconOutline: 'trophy-outline' },
  { id: 'settings', title: 'الإعدادات', icon: 'settings', iconOutline: 'settings-outline' },
];

export const BottomTabBar = () => {
  const { activeTab, navigateTo, theme, settings } = useApp();
  const isDarkMode = settings.isDarkMode;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.tabBarBg }]}>
      <View style={[styles.barContainer, { backgroundColor: theme.tabBarBg, borderTopColor: theme.divider }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconColor = isActive
            ? COLORS.greenLight
            : isDarkMode
            ? COLORS.greyLight
            : COLORS.greyDark;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => navigateTo(tab.id, null)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Ionicons
                  name={isActive ? tab.icon : tab.iconOutline}
                  size={22}
                  color={iconColor}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? (isDarkMode ? COLORS.yellowLight : COLORS.greenDark) : COLORS.greyLight,
                    fontFamily: isActive ? FONTS.bold : FONTS.medium,
                  },
                ]}
              >
                {tab.title}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  barContainer: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(23, 163, 29, 0.12)',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.greenLight,
    marginTop: 2,
  },
});
