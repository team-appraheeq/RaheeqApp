import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { FONTS } from '../constants/assets';
import { COLORS } from '../constants/colors';

export const TasbeehScreen = () => {
  const {
    theme,
    tasbeehState,
    TASBEEH_STEPS,
    incrementTasbeeh,
    resetTasbeeh,
    navigateTo,
  } = useApp();

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const { stepIndex, currentCount, totalCycles } = tasbeehState;
  const currentStep = TASBEEH_STEPS[stepIndex] || TASBEEH_STEPS[0];
  const targetCount = currentStep.countTarget;
  const stepPercentage = Math.round((currentCount / targetCount) * 100);

  const handleCirclePress = async () => {
    const res = await incrementTasbeeh();
    if (res?.isCompletedRound) {
      setShowCompletionModal(true);
    }
  };

  const handleRestart = () => {
    setShowCompletionModal(false);
    resetTasbeeh();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <AppHeader
        title="المسبحة الإلكترونية"
        showBack={true}
        onBack={() => navigateTo('activities', null)}
      />

      <View style={styles.container}>
        {/* Step Indicator Bar */}
        <View style={[styles.stepperContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cyclesText, { color: theme.textSecondary }]}>
            الدورات المكتملة: <Text style={{ fontFamily: FONTS.bold, color: COLORS.greenLight }}>{totalCycles}</Text>
          </Text>

          <View style={styles.stepsRow}>
            {TASBEEH_STEPS.map((step, idx) => {
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <View key={step.title} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isDone
                          ? COLORS.greenLight
                          : isCurrent
                          ? COLORS.yellowGold
                          : theme.isDark
                          ? '#2c2c2c'
                          : '#e2e8f0',
                      },
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    ) : (
                      <Text
                        style={[
                          styles.stepIndexText,
                          { color: isCurrent ? '#1a1a1a' : theme.textSecondary },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepTitleLabel,
                      {
                        color: isCurrent
                          ? (theme.isDark ? COLORS.yellowLight : COLORS.greenDark)
                          : isDone
                          ? COLORS.greenLight
                          : theme.textSecondary,
                        fontFamily: isCurrent ? FONTS.bold : FONTS.regular,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {step.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Current Dhikr Highlight */}
        <View style={styles.dhikrHighlight}>
          <Text style={[styles.currentStepBadge, { color: COLORS.yellowGold }]}>
            المرحلة ({stepIndex + 1} من 4)
          </Text>
          <Text style={[styles.mainDhikrText, { color: theme.textPrimary }]}>
            {currentStep.title}
          </Text>
          <Text style={[styles.targetHint, { color: theme.textSecondary }]}>
            الهدف: {targetCount} مرة
          </Text>
        </View>

        {/* Central Interactive Circle */}
        <View style={styles.circleWrapper}>
          <TouchableOpacity
            style={[
              styles.tasbeehCircle,
              {
                borderColor: COLORS.greenLight,
                backgroundColor: theme.isDark ? '#1b2a1c' : '#f0fdf4',
              },
            ]}
            onPress={handleCirclePress}
            activeOpacity={0.82}
          >
            <View style={styles.circleInner}>
              <Text style={[styles.counterNumber, { color: COLORS.greenDark }]}>
                {currentCount}
              </Text>
              <Text style={[styles.counterMax, { color: theme.textSecondary }]}>
                من {targetCount}
              </Text>

              {/* Progress bar inside circle */}
              <View style={styles.miniProgressTrack}>
                <View
                  style={[
                    styles.miniProgressBar,
                    { width: `${stepPercentage}%`, backgroundColor: COLORS.greenLight },
                  ]}
                />
              </View>

              <Text style={styles.tapText}>المس هنا للتسبيح</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls: Reset */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            onPress={resetTasbeeh}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={18} color="#dc2626" style={{ marginLeft: 6 }} />
            <Text style={[styles.resetButtonText, { color: '#dc2626' }]}>إعادة تعيين الجولة</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <View style={styles.modalIconBox}>
              <Ionicons name="trophy" size={40} color={COLORS.yellowGold} />
            </View>

            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              تقبل الله طاعتكم! 🎉
            </Text>
            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              لقد أتممت دورة التسبيح كاملة (132 تسبيحة) بنجاح:
              {'\n'}• 33 سبحان الله
              {'\n'}• 33 الحمد لله
              {'\n'}• 33 لا إله إلا الله
              {'\n'}• 33 الله أكبر
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalPrimaryButton, { backgroundColor: COLORS.greenDark }]}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                <Text style={styles.modalPrimaryText}>بدء دورة جديدة</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSecondaryButton, { borderColor: theme.border }]}
                onPress={() => setShowCompletionModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalSecondaryText, { color: theme.textPrimary }]}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  stepperContainer: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cyclesText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 10,
  },
  stepsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepIndexText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  stepTitleLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  dhikrHighlight: {
    alignItems: 'center',
    marginVertical: 10,
  },
  currentStepBadge: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    marginBottom: 4,
  },
  mainDhikrText: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    textAlign: 'center',
  },
  targetHint: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 4,
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  tasbeehCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.greenLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  counterNumber: {
    fontFamily: FONTS.bold,
    fontSize: 58,
    letterSpacing: 2,
    lineHeight: 68,
  },
  counterMax: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginTop: -4,
  },
  miniProgressTrack: {
    width: 110,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  miniProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  tapText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: '#888888',
    marginTop: 8,
  },
  controlsRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(234, 249, 93, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 20,
    width: '100%',
  },
  modalButtonsRow: {
    width: '100%',
    gap: 10,
  },
  modalPrimaryButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalPrimaryText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#ffffff',
  },
  modalSecondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalSecondaryText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
});
