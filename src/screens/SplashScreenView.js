import React from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { LOGOS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const SplashScreenView = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.greenDark} />
      <Image source={LOGOS.logo2} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#127019', // Solid green background with NO additions
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
