import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isWarning = toastMessage.type === 'warning';
  const isSuccess = toastMessage.type === 'success';

  const bgColor = isWarning
    ? '#422006'
    : isSuccess
    ? '#064e3b'
    : '#1e293b';

  const iconName = isWarning
    ? 'alert-circle'
    : isSuccess
    ? 'checkmark-circle'
    : 'information-circle';

  const iconColor = isWarning
    ? COLORS.yellowGold
    : isSuccess
    ? COLORS.greenLight
    : '#38bdf8';

  return (
    <View style={styles.toastWrapper} pointerEvents="none">
      <View style={[styles.toastCard, { backgroundColor: bgColor }]}>
        <Ionicons name={iconName} size={20} color={iconColor} style={{ marginLeft: 8 }} />
        <Text style={styles.toastText}>{toastMessage.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  toastText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: '#ffffff',
    flexShrink: 1,
    textAlign: 'right',
    lineHeight: 18,
  },
});
