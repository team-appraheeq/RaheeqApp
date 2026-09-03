import React, { useMemo } from 'react';
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
import { getIslamicOccasionsCountdown } from '../services/hijriCalendarService';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const CountdownScreen = () => {
  const { theme, now, navigateTo } = useApp();

  const occasions = useMemo(() => {
    return getIslamicOccasionsCountdown(now);
  }, [now]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader
        title="كم متبقٍ على المناسبات؟"
        showBack={true}
        onBack={() => navigateTo('activities', null)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.textPrimary }]}>
            العد التنازلي للمناسبات الإسلامية
          </Text>
          <Text style={[styles.introDesc, { color: theme.textSecondary }]}>
            ترقب الأيام الفضيلة واستعد لها بالصيام والذكر والعمل الصالح
          </Text>
        </View>

        <View style={styles.cardsList}>
          {occasions.map((occ) => {
            const targetDateStr = `${occ.targetDate.getDate()} / ${occ.targetDate.getMonth() + 1} / ${occ.targetDate.getFullYear()} م`;

            return (
              <View
                key={occ.id}
                style={[
                  styles.occCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.occHeader}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="sparkles" size={20} color={COLORS.yellowGold} />
                  </View>
                  <View style={styles.titleCol}>
                    <Text style={[styles.occTitle, { color: theme.textPrimary }]}>
                      {occ.title}
                    </Text>
                    <Text style={[styles.occSubtitle, { color: theme.textSecondary }]}>
                      {occ.subtitle}
                    </Text>
                  </View>
                </View>

                {/* Target Date Pill */}
                <View style={styles.targetDatePill}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.greenDark} style={{ marginLeft: 4 }} />
                  <Text style={styles.targetDateText}>التاريخ المتوقع: {targetDateStr}</Text>
                </View>

                {/* Digital Countdown Unit Boxes */}
                <View style={styles.countdownRow}>
                  {/* Days */}
                  <View style={[styles.unitBox, { backgroundColor: theme.isDark ? '#222' : '#f0fdf4' }]}>
                    <Text style={[styles.unitValue, { color: COLORS.greenDark }]}>{occ.days}</Text>
                    <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>يوم</Text>
                  </View>

                  <Text style={styles.unitSeparator}>:</Text>

                  {/* Hours */}
                  <View style={[styles.unitBox, { backgroundColor: theme.isDark ? '#222' : '#f0fdf4' }]}>
                    <Text style={[styles.unitValue, { color: COLORS.greenDark }]}>
                      {occ.hours.toString().padStart(2, '0')}
                    </Text>
                    <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>ساعة</Text>
                  </View>

                  <Text style={styles.unitSeparator}>:</Text>

                  {/* Minutes */}
                  <View style={[styles.unitBox, { backgroundColor: theme.isDark ? '#222' : '#f0fdf4' }]}>
                    <Text style={[styles.unitValue, { color: COLORS.greenDark }]}>
                      {occ.minutes.toString().padStart(2, '0')}
                    </Text>
                    <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>دقيقة</Text>
                  </View>

                  <Text style={styles.unitSeparator}>:</Text>

                  {/* Seconds */}
                  <View style={[styles.unitBox, { backgroundColor: theme.isDark ? '#222' : '#f0fdf4' }]}>
                    <Text style={[styles.unitValue, { color: COLORS.yellowGold }]}>
                      {occ.seconds.toString().padStart(2, '0')}
                    </Text>
                    <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>ثانية</Text>
                  </View>
                </View>
              </View>
            );
          })}
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
  introBox: {
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  introTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  introDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  cardsList: {
    gap: 14,
  },
  occCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  occHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(234, 249, 93, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  occTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginBottom: 2,
  },
  occSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: 'right',
  },
  targetDatePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 112, 25, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginBottom: 14,
  },
  targetDateText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.greenDark,
  },
  countdownRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(23, 163, 29, 0.2)',
  },
  unitValue: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  unitLabel: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    marginTop: -2,
  },
  unitSeparator: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#888888',
    marginHorizontal: 4,
  },
});
