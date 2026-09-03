import React from 'react';
import { View, StyleSheet, I18nManager, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from './src/context/AppContext';
import { SplashScreenView } from './src/screens/SplashScreenView';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ActivitiesScreen } from './src/screens/ActivitiesScreen';
import { AdhkarScreen } from './src/screens/AdhkarScreen';
import { PrayerTimesScreen } from './src/screens/PrayerTimesScreen';
import { TasbeehScreen } from './src/screens/TasbeehScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { CountdownScreen } from './src/screens/CountdownScreen';
import { NamesOfAllahScreen } from './src/screens/NamesOfAllahScreen';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { Toast } from './src/components/Toast';

const MainNavigator = () => {
  const { isLoading, userProfile, activeTab, activeSubScreen, settings, theme } = useApp();

  if (isLoading) {
    return <SplashScreenView />;
  }

  // If first time or logged out -> show Welcome / Onboarding screen
  if (!userProfile?.isOnboarded) {
    return (
      <View style={styles.rootContainer}>
        <ExpoStatusBar style="dark" />
        <WelcomeScreen />
        <Toast />
      </View>
    );
  }

  // Render active SubScreen if user navigated into an activity
  if (activeSubScreen) {
    let SubComponent = null;
    switch (activeSubScreen) {
      case 'adhkar':
      case 'adhkar_morning':
        SubComponent = <AdhkarScreen initialType="morning" />;
        break;
      case 'adhkar_evening':
        SubComponent = <AdhkarScreen initialType="evening" />;
        break;
      case 'prayerTimes':
        SubComponent = <PrayerTimesScreen />;
        break;
      case 'tasbeeh':
        SubComponent = <TasbeehScreen />;
        break;
      case 'calendar':
        SubComponent = <CalendarScreen />;
        break;
      case 'countdowns':
        SubComponent = <CountdownScreen />;
        break;
      case 'namesOfAllah':
        SubComponent = <NamesOfAllahScreen />;
        break;
      default:
        SubComponent = <ActivitiesScreen />;
    }

    return (
      <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
        <ExpoStatusBar style={settings.isDarkMode ? 'light' : 'dark'} />
        {SubComponent}
        <Toast />
      </View>
    );
  }

  // Render active Main Tab
  let TabComponent = null;
  switch (activeTab) {
    case 'home':
      TabComponent = <HomeScreen />;
      break;
    case 'activities':
      TabComponent = <ActivitiesScreen />;
      break;
    case 'achievements':
      TabComponent = <AchievementsScreen />;
      break;
    case 'settings':
      TabComponent = <SettingsScreen />;
      break;
    default:
      TabComponent = <HomeScreen />;
  }

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      <ExpoStatusBar style={settings.isDarkMode ? 'light' : 'dark'} />
      <View style={styles.contentContainer}>{TabComponent}</View>
      <BottomTabBar />
      <Toast />
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Cairo-Regular': require('./fonts/Cairo-Regular.ttf'),
    'Cairo-Medium': require('./fonts/Cairo-Medium.ttf'),
    'Cairo-Bold': require('./fonts/Cairo-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <SplashScreenView />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
