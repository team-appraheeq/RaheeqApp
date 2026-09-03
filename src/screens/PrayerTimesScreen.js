import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { PRAYER_BACKGROUNDS, FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const PrayerTimesScreen = () => {
  const { theme, prayerData, userProfile, navigateTo } = useApp();

  const currentPrayerKey = prayerData?.currentPrayerKey || 'duhur';
  const backgroundImage = PRAYER_BACKGROUNDS[currentPrayerKey] || PRAYER_BACKGROUNDS.duhur;

  const nextPrayer = prayerData?.nextPrayer;
  const times = prayerData?.times || [];
  const country = userProfile?.country;

  const PRAYER_ICONS = {
    fajr: 'cloudy-night-outline',
    sunrise: 'sunny-outline',
    duhur: 'sunny',
    asr: 'partly-sunny-outline',
    maghrib: 'cloudy-night',
    eshaa: 'moon-outline',
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader
        title="مواقيت الصلاة المعتمدة"
        showBack={true}
        onBack={() => navigateTo('activities', null)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic Background Banner */}
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={backgroundImage}
            style={styles.bannerBg}
            imageStyle={styles.bannerImageRadius}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerTop}>
                <View style={styles.countryPill}>
                  <Text style={styles.flagEmoji}>{country?.flag || '🇯🇴'}</Text>
                  <Text style={styles.countryLabel}>
                    {country?.capital} - {country?.name}
                  </Text>
                </View>
                <View style={styles.currentPrayerPill}>
                  <Text style={styles.currentPrayerText}>
                    الوقت الحالي: {prayerData?.currentPrayerKey ? 'فترة ' + prayerData.currentPrayerKey : ''}
                  </Text>
                </View>
              </View>

              {nextPrayer && (
                <View style={styles.nextPrayerSection}>
                  <Text style={styles.nextPrayerTitle}>الصلاة القادمة</Text>
                  <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                  <Text style={styles.nextPrayerTime}>{nextPrayer.formattedTime}</Text>

                  <View style={styles.countdownContainer}>
                    <Ionicons name="hourglass-outline" size={16} color={COLORS.yellowGold} />
                    <Text style={styles.countdownTitle}>متبقي للأذان:</Text>
                    <Text style={styles.countdownNumbers}>{nextPrayer.countdownFormatted}</Text>
                  </View>
                </View>
              )}
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Prayer Times Grid / Cards */}
        <View style={styles.timesSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            جدول مواقيت اليوم
          </Text>

          {times.map((item) => {
            const isNext = nextPrayer?.id === item.id;
            const isCurrent = currentPrayerKey === item.id;
            const iconName = PRAYER_ICONS[item.id] || 'time-outline';

            return (
              <View
                key={item.id}
                style={[
                  styles.prayerRow,
                  {
                    backgroundColor: isNext
                      ? 'rgba(23, 163, 29, 0.12)'
                      : theme.cardBg,
                    borderColor: isNext
                      ? COLORS.greenLight
                      : isCurrent
                      ? COLORS.yellowGold
                      : theme.cardBorder,
                  },
                ]}
              >
                {/* Time Display */}
                <View style={styles.timeBadge}>
                  <Text
                    style={[
                      styles.prayerTimeText,
                      { color: isNext ? COLORS.greenDark : theme.textPrimary },
                    ]}
                  >
                    {item.formatted}
                  </Text>
                </View>

                {/* Status Indicator */}
                <View style={styles.middleBadge}>
                  {isNext ? (
                    <View style={styles.nextBadgePill}>
                      <Text style={styles.nextBadgePillText}>القادمة</Text>
                    </View>
                  ) : isCurrent ? (
                    <View style={styles.currentBadgePill}>
                      <Text style={styles.currentBadgePillText}>الحالية</Text>
                    </View>
                  ) : null}
                </View>

                {/* Name & Icon */}
                <View style={styles.nameAndIcon}>
                  <Text
                    style={[
                      styles.prayerNameText,
                      { color: isNext ? COLORS.greenDark : theme.textPrimary },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isNext
                          ? COLORS.greenLight
                          : theme.isDark
                          ? '#2a2a2a'
                          : '#f0f4f0',
                      },
                    ]}
                  >
                    <Ionicons
                      name={iconName}
                      size={18}
                      color={isNext ? '#ffffff' : COLORS.greenDark}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Qibla & Calculation Method Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Ionicons name="compass-outline" size={20} color={COLORS.greenDark} />
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                {prayerData?.qiblaDirection || 180}° من الشمال
              </Text>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>اتجاه القبلة</Text>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoCol}>
              <Ionicons name="globe-outline" size={20} color={COLORS.greenDark} />
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                {country?.method || 'أم القرى'}
              </Text>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>طريقة الحساب</Text>
            </View>
          </View>
        </View>
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
  bannerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  bannerBg: {
    width: '100%',
    minHeight: 210,
  },
  bannerImageRadius: {
    borderRadius: 20,
  },
  bannerGradient: {
    padding: 16,
    minHeight: 210,
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  bannerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#ffffff',
  },
  currentPrayerPill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPrayerText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.yellowLight,
  },
  nextPrayerSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  nextPrayerTitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  nextPrayerName: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: '#ffffff',
    marginVertical: 2,
  },
  nextPrayerTime: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.yellowGold,
  },
  countdownContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  countdownTitle: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#ffffff',
  },
  countdownNumbers: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.yellowLight,
    letterSpacing: 1,
  },
  timesSection: {
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  prayerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  nameAndIcon: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerNameText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  middleBadge: {
    flex: 1,
    alignItems: 'center',
  },
  nextBadgePill: {
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nextBadgePillText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: '#ffffff',
  },
  currentBadgePill: {
    backgroundColor: COLORS.yellowGold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgePillText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: '#1a1a1a',
  },
  timeBadge: {
    minWidth: 75,
    alignItems: 'flex-start',
  },
  prayerTimeText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  infoValue: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    textAlign: 'center',
  },
  infoLabel: {
    fontFamily: FONTS.regular,
    fontSize: 11,
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#dddddd',
  },
});
