import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import {
  generateCalendarMonth,
  GREGORIAN_MONTHS_AR,
  HIJRI_MONTHS_AR,
  ARABIC_DAYS,
  formatFullArabicDate,
} from '../services/hijriCalendarService';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

const YEARS = [];
for (let y = 2026; y <= 2050; y++) {
  YEARS.push(y);
}

export const CalendarScreen = () => {
  const { theme, now, navigateTo } = useApp();

  const [selectedYear, setSelectedYear] = useState(now.getFullYear() >= 2026 ? now.getFullYear() : 2026);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedDayObj, setSelectedDayObj] = useState(null);

  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  const monthDays = useMemo(() => {
    return generateCalendarMonth(selectedYear, selectedMonth, now);
  }, [selectedYear, selectedMonth, now]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      if (selectedYear > 2026) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(11);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      if (selectedYear < 2050) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(0);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader
        title="التقويم الهجري والميلادي"
        showBack={true}
        onBack={() => navigateTo('activities', null)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Year and Month Navigation Bar */}
        <View style={[styles.navCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={styles.navArrow}
            onPress={handleNextMonth}
            disabled={selectedYear === 2050 && selectedMonth === 11}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={22} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.selectorsRow}>
            {/* Month Selector Button */}
            <TouchableOpacity
              style={[styles.selectorBtn, { backgroundColor: theme.isDark ? '#2a2a2a' : '#f0f4f0' }]}
              onPress={() => setIsMonthPickerVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="caret-down" size={14} color={COLORS.greenDark} style={{ marginLeft: 4 }} />
              <Text style={[styles.selectorBtnText, { color: theme.textPrimary }]}>
                {GREGORIAN_MONTHS_AR[selectedMonth]}
              </Text>
            </TouchableOpacity>

            {/* Year Selector Button */}
            <TouchableOpacity
              style={[styles.selectorBtn, { backgroundColor: theme.isDark ? '#2a2a2a' : '#f0f4f0' }]}
              onPress={() => setIsYearPickerVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="caret-down" size={14} color={COLORS.greenDark} style={{ marginLeft: 4 }} />
              <Text style={[styles.selectorBtnText, { color: theme.textPrimary }]}>
                {selectedYear} م
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.navArrow}
            onPress={handlePrevMonth}
            disabled={selectedYear === 2026 && selectedMonth === 0}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Days of Week Header */}
        <View style={styles.weekDaysHeader}>
          {ARABIC_DAYS.map((day) => (
            <View key={day} style={styles.weekDayCell}>
              <Text
                style={[
                  styles.weekDayText,
                  { color: day === 'الجمعة' ? COLORS.greenDark : theme.textSecondary },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={[styles.calendarGrid, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          {monthDays.map((item, index) => {
            const isSelected =
              selectedDayObj &&
              item.date.getDate() === selectedDayObj.date.getDate() &&
              item.date.getMonth() === selectedDayObj.date.getMonth() &&
              item.date.getFullYear() === selectedDayObj.date.getFullYear();

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  item.isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                  !item.isCurrentMonth && styles.otherMonthCell,
                ]}
                onPress={() => setSelectedDayObj(item)}
                activeOpacity={0.7}
              >
                {/* Gregorian Day Number */}
                <Text
                  style={[
                    styles.dayNumberText,
                    {
                      color: item.isToday
                        ? '#ffffff'
                        : item.isCurrentMonth
                        ? theme.textPrimary
                        : COLORS.greyLight,
                    },
                    item.isToday && styles.todayNumberText,
                  ]}
                >
                  {item.dayNumber}
                </Text>

                {/* Hijri Day Number */}
                <Text
                  style={[
                    styles.hijriDayText,
                    {
                      color: item.isToday
                        ? COLORS.yellowLight
                        : item.isWhiteDay
                        ? COLORS.greenLight
                        : theme.textSecondary,
                    },
                  ]}
                >
                  {item.hijriDay}
                </Text>

                {/* Markers */}
                {item.isToday && (
                  <View style={styles.todayIndicatorBadge}>
                    <Text style={styles.todayIndicatorText}>اليوم</Text>
                  </View>
                )}

                {item.isWhiteDay && item.isCurrentMonth && !item.isToday && (
                  <View style={styles.whiteDayDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Day Details Card (when tapped or defaults to today) */}
        {(() => {
          const activeItem = selectedDayObj || monthDays.find((d) => d.isToday) || monthDays[15];
          const info = formatFullArabicDate(activeItem.date);

          return (
            <View style={[styles.detailsCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              <View style={styles.detailsHeader}>
                <View style={styles.detailsBadge}>
                  <Text style={styles.detailsBadgeText}>{info.dayName}</Text>
                </View>
                <Text style={[styles.detailsTitle, { color: theme.textPrimary }]}>
                  تفاصيل اليوم المختار
                </Text>
              </View>

              <View style={styles.datesList}>
                <View style={styles.dateRowItem}>
                  <Text style={[styles.dateRowVal, { color: COLORS.greenDark }]}>{info.hijri}</Text>
                  <Text style={[styles.dateRowLabel, { color: theme.textSecondary }]}>
                    التاريخ الهجري:
                  </Text>
                </View>

                <View style={styles.dateRowItem}>
                  <Text style={[styles.dateRowVal, { color: theme.textPrimary }]}>{info.gregorian}</Text>
                  <Text style={[styles.dateRowLabel, { color: theme.textSecondary }]}>
                    التاريخ الميلادي:
                  </Text>
                </View>

                {activeItem.isWhiteDay && (
                  <View style={styles.whiteDayNotice}>
                    <Ionicons name="moon-outline" size={16} color={COLORS.greenLight} style={{ marginLeft: 6 }} />
                    <Text style={styles.whiteDayNoticeText}>
                      من الأيام البيض المستحب صيامها (13، 14، 15 من الشهر الهجري)
                    </Text>
                  </View>
                )}

                {activeItem.isFriday && (
                  <View style={styles.fridayNotice}>
                    <Ionicons name="sparkles-outline" size={16} color={COLORS.yellowGold} style={{ marginLeft: 6 }} />
                    <Text style={styles.fridayNoticeText}>
                      يوم الجمعة المبارك: أكثر من الصلاة على النبي ﷺ وقراءة سورة الكهف
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })()}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal
        visible={isMonthPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMonthPickerVisible(false)}
      >
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.pickerModalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>اختر الشهر</Text>
            <View style={styles.monthsGrid}>
              {GREGORIAN_MONTHS_AR.map((monthName, idx) => (
                <TouchableOpacity
                  key={monthName}
                  style={[
                    styles.monthItemBtn,
                    selectedMonth === idx && { backgroundColor: COLORS.greenDark },
                  ]}
                  onPress={() => {
                    setSelectedMonth(idx);
                    setIsMonthPickerVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.monthItemText,
                      { color: selectedMonth === idx ? '#ffffff' : theme.textPrimary },
                      selectedMonth === idx && { fontFamily: FONTS.bold },
                    ]}
                  >
                    {monthName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Year Picker Modal (2026 - 2050) */}
      <Modal
        visible={isYearPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsYearPickerVisible(false)}
      >
        <SafeAreaView style={styles.modalBackdrop}>
          <View style={[styles.pickerModalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalHeading, { color: theme.textPrimary }]}>
              اختر السنة (2026 - 2050)
            </Text>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={true}>
              <View style={styles.yearsGrid}>
                {YEARS.map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    style={[
                      styles.yearItemBtn,
                      selectedYear === yr && { backgroundColor: COLORS.greenDark },
                    ]}
                    onPress={() => {
                      setSelectedYear(yr);
                      setIsYearPickerVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.yearItemText,
                        { color: selectedYear === yr ? '#ffffff' : theme.textPrimary },
                        selectedYear === yr && { fontFamily: FONTS.bold },
                      ]}
                    >
                      {yr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
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
  navCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  selectorBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  selectorBtnText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  weekDaysHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  calendarGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: 16,
  },
  dayCell: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 10,
    marginVertical: 2,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: COLORS.greenDark,
    borderRadius: 10,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: COLORS.yellowGold,
  },
  otherMonthCell: {
    opacity: 0.35,
  },
  dayNumberText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  todayNumberText: {
    color: '#ffffff',
  },
  hijriDayText: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    marginTop: -2,
  },
  todayIndicatorBadge: {
    position: 'absolute',
    top: -4,
    backgroundColor: COLORS.yellowGold,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  todayIndicatorText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#1a1a1a',
  },
  whiteDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.greenLight,
    position: 'absolute',
    bottom: 2,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  detailsHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    paddingBottom: 8,
  },
  detailsTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  detailsBadge: {
    backgroundColor: 'rgba(23, 163, 29, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  detailsBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.greenDark,
  },
  datesList: {
    gap: 8,
  },
  dateRowItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRowLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  dateRowVal: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  whiteDayNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 163, 29, 0.08)',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  whiteDayNoticeText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.greenDark,
    flexShrink: 1,
    textAlign: 'right',
  },
  fridayNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 249, 93, 0.15)',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  fridayNoticeText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: '#854d0e',
    flexShrink: 1,
    textAlign: 'right',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pickerModalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },
  modalHeading: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  monthsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthItemBtn: {
    width: '31%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  monthItemText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  yearsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearItemBtn: {
    width: '23%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  yearItemText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
});
