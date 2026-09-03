import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const AchievementsScreen = () => {
  const { theme, historyLog, streakStats, dailyProgress } = useApp();

  const { currentStreak, perfectDays, totalDays, completionRate } = streakStats;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader title="سجل الإنجاز والمواظبة" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Summary Stats Cards */}
        <View style={styles.statsGrid}>
          {/* Consecutive Days Streak */}
          <View style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(23, 163, 29, 0.12)' }]}>
              <Ionicons name="flame" size={24} color={COLORS.greenLight} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.greenDark }]}>{currentStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>الأيام المتتالية</Text>
          </View>

          {/* Perfect 100% Days */}
          <View style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(234, 249, 93, 0.2)' }]}>
              <Ionicons name="ribbon" size={24} color={COLORS.yellowGold} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.yellowGold }]}>{perfectDays}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>الأيام المتكاملة (100%)</Text>
          </View>
        </View>

        {/* Motivational Banner */}
        <View style={[styles.motivationCard, { backgroundColor: theme.isDark ? '#1a291a' : '#f0fdf4' }]}>
          <Ionicons name="star" size={20} color={COLORS.yellowGold} style={{ marginLeft: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.motivationTitle, { color: COLORS.greenDark }]}>
              «أَحَبُّ الأَعْمَالِ إِلَى اللهِ أَدْوَمُهَا وَإِنْ قَلَّ»
            </Text>
            <Text style={[styles.motivationSubtitle, { color: theme.textSecondary }]}>
              استمرارك اليومي في العبادة هو سر البركة والتوفيق.
            </Text>
          </View>
        </View>

        {/* Today's Live Status */}
        <View style={[styles.todayCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.todayHeader}>
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>{dailyProgress.percentage}%</Text>
            </View>
            <Text style={[styles.todayTitle, { color: theme.textPrimary }]}>إنجاز اليوم الحالي</Text>
          </View>
          <Text style={[styles.todayDesc, { color: theme.textSecondary }]}>
            أتممت {dailyProgress.completed} من أصل {dailyProgress.total} مهام حتى الآن.
          </Text>
        </View>

        {/* Previous Days History Log */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <Text style={[styles.historyCountBadge, { color: theme.textSecondary }]}>
              ({historyLog.length} يوم مسجل)
            </Text>
            <Text style={[styles.historySectionTitle, { color: theme.textPrimary }]}>
              سجل الأيام السابقة
            </Text>
          </View>

          {historyLog.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <Ionicons name="calendar-outline" size={40} color={COLORS.greyLight} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                لا يوجد سجلات سابقة بعد
              </Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                سيتم أرشفة وحفظ إنجازاتك اليومية تلقائياً بعد منتصف كل ليلة (00:00).
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {historyLog.map((record, index) => {
                const isPerfect = record.percentage === 100;

                return (
                  <View
                    key={record.dateStr || index}
                    style={[
                      styles.historyItemCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: isPerfect ? COLORS.greenLight : theme.cardBorder,
                      },
                      isPerfect && styles.historyItemPerfect,
                    ]}
                  >
                    {/* Percentage Circle / Badge */}
                    <View
                      style={[
                        styles.percentBadge,
                        {
                          backgroundColor: isPerfect
                            ? COLORS.greenLight
                            : record.percentage >= 50
                            ? 'rgba(23, 163, 29, 0.12)'
                            : 'rgba(234, 249, 93, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.percentText,
                          {
                            color: isPerfect
                              ? '#ffffff'
                              : record.percentage >= 50
                              ? COLORS.greenDark
                              : '#854d0e',
                          },
                        ]}
                      >
                        {record.percentage}%
                      </Text>
                    </View>

                    {/* Day Details */}
                    <View style={styles.historyItemDetails}>
                      <View style={styles.historyItemTopRow}>
                        <Text style={[styles.dayNameText, { color: theme.textPrimary }]}>
                          يوم {record.dayName}
                        </Text>
                        <View style={styles.dayIndexPill}>
                          <Text style={styles.dayIndexText}>يوم #{record.dayNumber}</Text>
                        </View>
                      </View>

                      <Text style={[styles.dateSubText, { color: theme.textSecondary }]}>
                        {record.gregorianDate}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  motivationCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(23, 163, 29, 0.2)',
  },
  motivationTitle: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    textAlign: 'right',
    lineHeight: 18,
  },
  motivationSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  todayCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  todayHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  todayTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  todayBadge: {
    backgroundColor: COLORS.greenDark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#ffffff',
  },
  todayDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    textAlign: 'right',
  },
  historySection: {
    gap: 8,
  },
  historySectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  historySectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  historyCountBadge: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  emptyBox: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  emptyDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  historyList: {
    gap: 8,
  },
  historyItemCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  historyItemPerfect: {
    backgroundColor: 'rgba(23, 163, 29, 0.04)',
  },
  historyItemDetails: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 12,
  },
  historyItemTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  dayNameText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  dayIndexPill: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  dayIndexText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: '#666666',
  },
  dateSubText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    marginTop: 2,
  },
  percentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 54,
    alignItems: 'center',
  },
  percentText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
});
