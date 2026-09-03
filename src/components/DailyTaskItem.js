import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';
import { checkTaskEligibility } from '../services/prayerTimesService';

export const DailyTaskItem = ({
  id,
  title,
  subtitle,
  isDone,
  actionButtonText,
  onActionPress,
}) => {
  const { theme, toggleDailyTask, prayerData, now } = useApp();

  const eligibility = checkTaskEligibility(id, prayerData, now);
  const isLocked = !isDone && !eligibility.eligible;

  const handlePress = () => {
    toggleDailyTask(id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          borderColor: isDone ? COLORS.greenLight : theme.cardBorder,
        },
        isDone && styles.completedContainer,
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Checkbox (RTL Right side) */}
      <View
        style={[
          styles.checkbox,
          {
            borderColor: isDone ? COLORS.greenLight : isLocked ? '#999' : theme.border,
            backgroundColor: isDone ? COLORS.greenLight : isLocked ? 'rgba(0,0,0,0.04)' : 'transparent',
          },
        ]}
      >
        {isDone ? (
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        ) : isLocked ? (
          <Ionicons name="lock-closed" size={12} color="#888888" />
        ) : null}
      </View>

      {/* Center Details */}
      <View style={styles.textSection}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.taskTitle,
              { color: isDone ? COLORS.greenDark : theme.textPrimary },
              isDone && styles.taskTitleDone,
            ]}
          >
            {title}
          </Text>
          {isLocked && (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedBadgeText}>لم يحن وقته بعد</Text>
            </View>
          )}
        </View>

        {subtitle ? (
          <Text style={[styles.taskSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Action Button (e.g. go to adhkar / tasbeeh) */}
      {actionButtonText && onActionPress && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDone ? 'rgba(23, 163, 29, 0.12)' : 'rgba(18, 112, 25, 0.1)' },
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onActionPress();
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, { color: COLORS.greenDark }]}>
            {actionButtonText}
          </Text>
          <Ionicons name="chevron-back" size={14} color={COLORS.greenDark} style={{ marginRight: 2 }} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 14,
    borderWidth: 1.5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  completedContainer: {
    backgroundColor: 'rgba(23, 163, 29, 0.05)',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  textSection: {
    flex: 1,
    alignItems: 'flex-end', // RTL
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  taskTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.85,
  },
  taskSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  lockedBadge: {
    backgroundColor: 'rgba(175, 172, 172, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  lockedBadgeText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: '#777777',
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
  },
  actionButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
  },
});
