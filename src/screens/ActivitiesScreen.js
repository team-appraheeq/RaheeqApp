import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

const ACTIVITIES = [
  {
    id: 'adhkar',
    title: 'الأذكار اليومية',
    subtitle: 'أذكار الصباح والمساء كاملة مع عدادات إنجاز تفاعلية',
    icon: 'book-outline',
    iconLib: 'ionicons',
    badge: 'حصن المسلم',
    color: '#127019',
  },
  {
    id: 'prayerTimes',
    title: 'مواقيت الصلاة المعتمدة',
    subtitle: 'مواقيت الصلاة الدقيقة لعاصمة بلدك مع خلفيات ديناميكية',
    icon: 'time-outline',
    iconLib: 'ionicons',
    badge: 'مباشر',
    color: '#17a31d',
  },
  {
    id: 'tasbeeh',
    title: 'المسبحة الإلكترونية',
    subtitle: 'تسبيح سلس (سبحان الله، الحمدلله، لا إله إلا الله، الله أكبر)',
    icon: 'hand-left-outline',
    iconLib: 'ionicons',
    badge: '33 × 4',
    color: '#b89c00',
  },
  {
    id: 'calendar',
    title: 'التقويم الهجري والميلادي',
    subtitle: 'تقويم كامل وشامل من 2026 لغاية 2050 مع تمييز اليوم والمناسبات',
    icon: 'calendar-outline',
    iconLib: 'ionicons',
    badge: '2026 - 2050',
    color: '#127019',
  },
  {
    id: 'countdowns',
    title: 'كم متبقٍ؟',
    subtitle: 'عد تنازلي مباشر لرمضان، عيد الفطر، عيد الأضحى، والمولد النبوي',
    icon: 'hourglass-outline',
    iconLib: 'ionicons',
    badge: 'المناسبات',
    color: '#dddd12',
  },
  {
    id: 'namesOfAllah',
    title: 'أسماء الله الحسنى',
    subtitle: 'الأسماء الحسنى الـ 99 كاملة مع أرقامها ومعانيها وشرحها الوافي',
    icon: 'sparkles-outline',
    iconLib: 'ionicons',
    badge: '99 اسماً',
    color: '#17a31d',
  },
];

export const ActivitiesScreen = () => {
  const { theme, navigateTo } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader title="قائمة الفعاليات" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.textPrimary }]}>واحة الفعاليات الإيمانية</Text>
          <Text style={[styles.introDesc, { color: theme.textSecondary }]}>
            مجموعة متكاملة من الخدمات والأدوات الإيمانية لتعزيز يومك بالطاعات
          </Text>
        </View>

        <View style={styles.grid}>
          {ACTIVITIES.map((act) => (
            <TouchableOpacity
              key={act.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                },
              ]}
              onPress={() => navigateTo('activities', act.id)}
              activeOpacity={0.75}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: 'rgba(18, 112, 25, 0.12)' }]}>
                  <Text style={[styles.badgeText, { color: COLORS.greenDark }]}>{act.badge}</Text>
                </View>

                <View style={[styles.iconBox, { backgroundColor: 'rgba(23, 163, 29, 0.12)' }]}>
                  <Ionicons name={act.icon} size={24} color={COLORS.greenDark} />
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{act.title}</Text>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                {act.subtitle}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.openText, { color: COLORS.greenLight }]}>فتح القائمة</Text>
                <Ionicons name="arrow-back" size={16} color={COLORS.greenLight} />
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 28,
  },
  introBox: {
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  introTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 4,
  },
  introDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  openText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
});
