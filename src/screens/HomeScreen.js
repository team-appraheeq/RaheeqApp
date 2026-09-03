import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { DigitalClockCard } from '../components/DigitalClockCard';
import { DailyTaskItem } from '../components/DailyTaskItem';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const HomeScreen = () => {
  const { theme, dailyTasks, dailyProgress, navigateTo } = useApp();

  const { completed, total, percentage } = dailyProgress;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Digital Clock Card */}
        <DigitalClockCard />

        {/* Daily Achievement Progress Bar */}
        <View style={[styles.progressCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.progressHeader}>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{percentage}%</Text>
            </View>
            <View style={styles.progressTitleBox}>
              <Text style={[styles.progressTitle, { color: theme.textPrimary }]}>
                شريط الإنجاز اليومي
              </Text>
              <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
                أنجزت {completed} من أصل {total} مهام اليوم
              </Text>
            </View>
          </View>

          {/* Visual Progress Track */}
          <View style={[styles.progressTrack, { backgroundColor: theme.isDark ? '#2a2a2a' : '#e2e8f0' }]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${percentage}%`,
                  backgroundColor: percentage === 100 ? COLORS.yellowGold : COLORS.greenLight,
                },
              ]}
            />
          </View>
        </View>

        {/* Daily Tasks Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            مهام اليوم الإيمانية
          </Text>
          <View style={styles.sectionIcon}>
            <Ionicons name="checkbox-outline" size={18} color={COLORS.greenLight} />
          </View>
        </View>

        {/* 9 Daily Checkable Tasks */}
        <View style={styles.tasksList}>
          {/* 1. Fajr */}
          <DailyTaskItem
            id="fajr"
            title="صلاة الفجر"
            subtitle="ركعتان خير من الدنيا وما فيها"
            isDone={dailyTasks.fajr}
          />

          {/* 2. Quran 2 pages */}
          <DailyTaskItem
            id="quran"
            title="قراءة ورد صفحتين من القرآن"
            subtitle="أحضر مصحفك واقرأ صفحتين بتدبر"
            isDone={dailyTasks.quran}
          />

          {/* 3. Morning Adhkar */}
          <DailyTaskItem
            id="morningAdhkar"
            title="أذكار الصباح"
            subtitle="حصن المسلم وبركة اليوم"
            isDone={dailyTasks.morningAdhkar}
            actionButtonText="انقر لقراءة الأذكار"
            onActionPress={() => navigateTo('activities', 'adhkar_morning')}
          />

          {/* 4. Dhuhr */}
          <DailyTaskItem
            id="duhur"
            title="صلاة الظهر"
            subtitle="أربع ركعات في وقت الهجير"
            isDone={dailyTasks.duhur}
          />

          {/* 5. Asr */}
          <DailyTaskItem
            id="asr"
            title="صلاة العصر"
            subtitle="الصلاة الوسطى، حافظ عليها"
            isDone={dailyTasks.asr}
          />

          {/* 6. Evening Adhkar */}
          <DailyTaskItem
            id="eveningAdhkar"
            title="أذكار المساء"
            subtitle="حفظ من كل سوء حتى تصبح"
            isDone={dailyTasks.eveningAdhkar}
            actionButtonText="انقر لقراءة الأذكار"
            onActionPress={() => navigateTo('activities', 'adhkar_evening')}
          />

          {/* 7. Maghrib */}
          <DailyTaskItem
            id="maghrib"
            title="صلاة المغرب"
            subtitle="ثلاث ركعات مع غروب الشمس"
            isDone={dailyTasks.maghrib}
          />

          {/* 8. Isha */}
          <DailyTaskItem
            id="eshaa"
            title="صلاة العشاء"
            subtitle="ختام صلوات اليوم المفروضة"
            isDone={dailyTasks.eshaa}
          />

          {/* 9. Evening Istighfar */}
          <DailyTaskItem
            id="eveningIstighfar"
            title="الاستغفار والتسبيح المسائي"
            subtitle="تفريج للهموم وتكفير للسيئات"
            isDone={dailyTasks.eveningIstighfar}
            actionButtonText="انقر للتسبيح"
            onActionPress={() => navigateTo('activities', 'tasbeeh')}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitleBox: {
    alignItems: 'flex-end',
    flex: 1,
  },
  progressTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  progressSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    marginTop: 2,
  },
  progressBadge: {
    backgroundColor: COLORS.greenDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#ffffff',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  sectionIcon: {
    padding: 4,
  },
  tasksList: {
    gap: 4,
  },
});
