import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { MORNING_ADHKAR, EVENING_ADHKAR } from '../constants/adhkarData';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const AdhkarScreen = ({ initialType = 'morning' }) => {
  const {
    theme,
    adhkarProgress,
    updateAdhkarItemCount,
    resetAdhkar,
    navigateTo,
    activeSubScreen,
  } = useApp();

  const [activeTab, setActiveTab] = useState(
    activeSubScreen === 'adhkar_evening' ? 'evening' : initialType
  );

  const currentList = activeTab === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR;

  // Calculate overall completed count for active tab
  const tabProgress = useMemo(() => {
    let completedCount = 0;
    currentList.forEach((item) => {
      const current = adhkarProgress[item.id] || 0;
      if (current >= item.count) {
        completedCount++;
      }
    });
    const percentage = Math.round((completedCount / currentList.length) * 100);
    return { completedCount, total: currentList.length, percentage };
  }, [currentList, adhkarProgress]);

  const handleResetCurrentTab = () => {
    const ids = currentList.map((i) => i.id);
    resetAdhkar(ids);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader
        title={activeTab === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}
        showBack={true}
        onBack={() => navigateTo('activities', null)}
      />

      {/* Tabs Header */}
      <View style={[styles.tabBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'morning' && [
              styles.tabButtonActive,
              { borderBottomColor: COLORS.greenLight, backgroundColor: 'rgba(23, 163, 29, 0.08)' },
            ],
          ]}
          onPress={() => setActiveTab('morning')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="sunny"
            size={18}
            color={activeTab === 'morning' ? COLORS.greenDark : COLORS.greyLight}
            style={{ marginLeft: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'morning' ? (theme.isDark ? COLORS.yellowLight : COLORS.greenDark) : COLORS.greyLight,
                fontFamily: activeTab === 'morning' ? FONTS.bold : FONTS.medium,
              },
            ]}
          >
            أذكار الصباح
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'evening' && [
              styles.tabButtonActive,
              { borderBottomColor: COLORS.greenLight, backgroundColor: 'rgba(23, 163, 29, 0.08)' },
            ],
          ]}
          onPress={() => setActiveTab('evening')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="moon"
            size={18}
            color={activeTab === 'evening' ? COLORS.greenDark : COLORS.greyLight}
            style={{ marginLeft: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'evening' ? (theme.isDark ? COLORS.yellowLight : COLORS.greenDark) : COLORS.greyLight,
                fontFamily: activeTab === 'evening' ? FONTS.bold : FONTS.medium,
              },
            ]}
          >
            أذكار المساء
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress & Reset Banner */}
      <View style={[styles.progressBanner, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetCurrentTab}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={16} color={COLORS.greyDark} style={{ marginLeft: 4 }} />
          <Text style={[styles.resetButtonText, { color: theme.textSecondary }]}>إعادة تعيين</Text>
        </TouchableOpacity>

        <View style={styles.progressInfo}>
          <Text style={[styles.progressCountText, { color: theme.textPrimary }]}>
            مكتمل: {tabProgress.completedCount} من {tabProgress.total} ({tabProgress.percentage}%)
          </Text>
        </View>
      </View>

      {/* Adhkar List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {currentList.map((item, index) => {
          const currentCount = adhkarProgress[item.id] || 0;
          const isCompleted = currentCount >= item.count;
          const remaining = Math.max(0, item.count - currentCount);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.dhikrCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: isCompleted ? COLORS.greenLight : theme.cardBorder,
                },
                isCompleted && styles.dhikrCardCompleted,
              ]}
              onPress={() => updateAdhkarItemCount(item.id, item.count)}
              activeOpacity={0.8}
            >
              {/* Top Header of Card */}
              <View style={styles.dhikrCardHeader}>
                {/* Count Badge / Checkmark */}
                <View
                  style={[
                    styles.counterBadge,
                    {
                      backgroundColor: isCompleted ? COLORS.greenLight : 'rgba(18, 112, 25, 0.12)',
                    },
                  ]}
                >
                  {isCompleted ? (
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
                      <Text style={[styles.counterText, { color: '#ffffff' }]}>تم الإنجاز</Text>
                    </View>
                  ) : (
                    <Text style={[styles.counterText, { color: COLORS.greenDark }]}>
                      {remaining} / {item.count}
                    </Text>
                  )}
                </View>

                {/* Dhikr Number */}
                <View style={[styles.numberCircle, { backgroundColor: theme.isDark ? '#2a2a2a' : '#f0f4f0' }]}>
                  <Text style={[styles.numberText, { color: theme.textSecondary }]}>{index + 1}</Text>
                </View>
              </View>

              {/* Title if any */}
              {item.title && (
                <Text style={[styles.dhikrTitle, { color: COLORS.greenDark }]}>{item.title}</Text>
              )}

              {/* Main Dhikr Text */}
              <Text style={[styles.dhikrText, { color: theme.textPrimary }]}>{item.text}</Text>

              {/* Virtue / Fadl */}
              {item.virtue && (
                <View style={[styles.virtueBox, { backgroundColor: theme.isDark ? '#222' : '#f9fbf9' }]}>
                  <Ionicons name="information-circle-outline" size={14} color={COLORS.greenLight} style={{ marginLeft: 4 }} />
                  <Text style={[styles.virtueText, { color: theme.textSecondary }]}>{item.virtue}</Text>
                </View>
              )}

              {/* Tap to count hint */}
              {!isCompleted && (
                <View style={styles.tapHintRow}>
                  <Ionicons name="finger-print-outline" size={14} color={COLORS.greyLight} />
                  <Text style={styles.tapHintText}>انقر في أي مكان في البطاقة للعد</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
  },
  progressBanner: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressCountText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  resetButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resetButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 12,
  },
  dhikrCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  dhikrCardCompleted: {
    backgroundColor: 'rgba(23, 163, 29, 0.04)',
  },
  dhikrCardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  counterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  dhikrTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    textAlign: 'right',
    marginBottom: 6,
  },
  dhikrText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'right',
    marginBottom: 8,
  },
  virtueBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  virtueText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    flexShrink: 1,
    textAlign: 'right',
    lineHeight: 16,
  },
  tapHintRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  tapHintText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: '#888888',
  },
});
