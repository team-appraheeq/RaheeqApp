import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SKY_IMAGES, FONTS } from '../constants/assets';
import { formatFullArabicDate } from '../services/hijriCalendarService';
import { COLORS } from '../constants/colors';

export const DigitalClockCard = () => {
  const { now, prayerData, userProfile } = useApp();

  const currentSkyKey = prayerData?.currentPrayerKey || 'duhur';
  const skyImage = SKY_IMAGES[currentSkyKey] || SKY_IMAGES.duhur;

  const dateInfo = useMemo(() => {
    return formatFullArabicDate(now);
  }, [now]);

  // Live time string (HH:MM:SS)
  const timeDetails = useMemo(() => {
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isPM = hours >= 12;
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      period: isPM ? 'م' : 'ص',
    };
  }, [now]);

  const nextPrayer = prayerData?.nextPrayer;
  const countryName = userProfile?.country?.name || 'الأردن';
  const capitalName = userProfile?.country?.capital || 'عمان';
  const countryFlag = userProfile?.country?.flag || '🇯🇴';

  return (
    <View style={styles.cardContainer}>
      <ImageBackground source={skyImage} style={styles.backgroundImage} imageStyle={styles.imageRadius}>
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.85)']}
          style={styles.gradientOverlay}
        >
          {/* Top Bar: Location & Day */}
          <View style={styles.topRow}>
            <View style={styles.locationBadge}>
              <Text style={styles.flagText}>{countryFlag}</Text>
              <Text style={styles.locationText}>
                {capitalName} - {countryName}
              </Text>
            </View>

            <View style={styles.dayBadge}>
              <Ionicons name="calendar-outline" size={13} color={COLORS.yellowGold} style={{ marginLeft: 4 }} />
              <Text style={styles.dayText}>{dateInfo.dayName}</Text>
            </View>
          </View>

          {/* Center: Live Digital Clock */}
          <View style={styles.clockSection}>
            <View style={styles.timeRow}>
              <Text style={styles.periodText}>{timeDetails.period}</Text>
              <Text style={styles.timeMainText}>
                {timeDetails.hours}:{timeDetails.minutes}
              </Text>
              <Text style={styles.secondsText}>:{timeDetails.seconds}</Text>
            </View>

            {/* Dates: Hijri & Gregorian */}
            <View style={styles.datesRow}>
              <Text style={styles.hijriDateText}>{dateInfo.hijri}</Text>
              <Text style={styles.dateDot}>•</Text>
              <Text style={styles.gregorianDateText}>{dateInfo.gregorian}</Text>
            </View>
          </View>

          {/* Bottom Bar: Next Prayer Countdown */}
          {nextPrayer && (
            <View style={styles.nextPrayerBanner}>
              <View style={styles.nextPrayerInfo}>
                <Ionicons name="time-outline" size={16} color={COLORS.yellowGold} />
                <Text style={styles.nextPrayerLabel}>
                  متبقي لـ {nextPrayer.name} ({nextPrayer.formattedTime})
                </Text>
              </View>
              <View style={styles.countdownBadge}>
                <Text style={styles.countdownValue}>{nextPrayer.countdownFormatted}</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    minHeight: 195,
  },
  imageRadius: {
    borderRadius: 20,
  },
  gradientOverlay: {
    padding: 16,
    borderRadius: 20,
    justifyContent: 'space-between',
    minHeight: 195,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  flagText: {
    fontSize: 14,
    marginLeft: 6,
  },
  locationText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#ffffff',
  },
  dayBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 249, 93, 0.4)',
  },
  dayText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.yellowLight,
  },
  clockSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  timeMainText: {
    fontFamily: FONTS.bold,
    fontSize: 38,
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  secondsText: {
    fontFamily: FONTS.medium,
    fontSize: 20,
    color: COLORS.yellowGold,
    marginRight: 2,
  },
  periodText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.yellowLight,
    marginLeft: 8,
  },
  datesRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  hijriDateText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.yellowLight,
  },
  dateDot: {
    color: 'rgba(255,255,255,0.6)',
    marginHorizontal: 6,
  },
  gregorianDateText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  nextPrayerBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  nextPrayerInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  nextPrayerLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#ffffff',
  },
  countdownBadge: {
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countdownValue: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#ffffff',
    letterSpacing: 1,
  },
});
