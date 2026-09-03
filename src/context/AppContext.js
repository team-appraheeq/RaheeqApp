import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { StorageService } from '../services/storageService';
import { COUNTRIES, DEFAULT_COUNTRY } from '../constants/countries';
import { calculatePrayerTimes, checkTaskEligibility } from '../services/prayerTimesService';
import { formatFullArabicDate, gregorianToHijri } from '../services/hijriCalendarService';
import { getTheme } from '../constants/colors';

const AppContext = createContext(null);

const DEFAULT_TASKS = {
  fajr: false,
  quran: false,
  morningAdhkar: false,
  duhur: false,
  asr: false,
  eveningAdhkar: false,
  maghrib: false,
  eshaa: false,
  eveningIstighfar: false,
};

const TASK_KEYS = Object.keys(DEFAULT_TASKS);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [settings, setSettings] = useState({ isDarkMode: false, hapticsEnabled: true });
  const [now, setNow] = useState(new Date());

  const [dailyTasks, setDailyTasks] = useState(DEFAULT_TASKS);
  const [currentDateStr, setCurrentDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [historyLog, setHistoryLog] = useState([]);
  const [tasbeehState, setTasbeehState] = useState({ stepIndex: 0, currentCount: 0, totalCycles: 0 });
  const [adhkarProgress, setAdhkarProgress] = useState({});

  // Navigation state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'activities' | 'achievements' | 'settings'
  const [activeSubScreen, setActiveSubScreen] = useState(null); // 'adhkar' | 'prayerTimes' | 'tasbeeh' | 'calendar' | 'countdowns' | 'namesOfAllah' | 'privacyPolicy'

  // Toast / Alert message state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = 'info') => {
    setToastMessage({ message: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Live timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      setNow(currentDate);

      // Check for midnight day rollover
      const todayStr = currentDate.toISOString().split('T')[0];
      if (todayStr !== currentDateStr) {
        handleDayRollover(currentDateStr, todayStr, currentDate);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentDateStr, dailyTasks, historyLog, userProfile]);

  // Load initial data from AsyncStorage
  useEffect(() => {
    const initialize = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        setCurrentDateStr(todayStr);

        const [profile, loadedSettings, tasks, history, tasbeeh, adhkar] = await Promise.all([
          StorageService.getUserProfile(),
          StorageService.getSettings(),
          StorageService.getDailyTasks(todayStr),
          StorageService.getHistoryLog(),
          StorageService.getTasbeehState(),
          StorageService.getAdhkarProgress(todayStr),
        ]);

        if (profile) {
          // Normalize country object
          const countryObj = COUNTRIES.find((c) => c.id === profile.countryId) || DEFAULT_COUNTRY;
          setUserProfile({
            ...profile,
            country: countryObj,
          });
        }

        if (loadedSettings) setSettings(loadedSettings);
        if (tasks) setDailyTasks(tasks);
        if (history) setHistoryLog(history);
        if (tasbeeh) setTasbeehState(tasbeeh);
        if (adhkar) setAdhkarProgress(adhkar);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500); // Allow splash logo2 to show cleanly
      }
    };

    initialize();
  }, []);

  // Handle midnight day rollover
  const handleDayRollover = async (oldDateStr, newDateStr, dateObj) => {
    try {
      // Archive old day to history
      const completedCount = Object.values(dailyTasks).filter(Boolean).length;
      const totalCount = TASK_KEYS.length;
      const percentage = Math.round((completedCount / totalCount) * 100);

      const yesterdayDate = new Date(dateObj);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const dateInfo = formatFullArabicDate(yesterdayDate);

      const dayRecord = {
        dateStr: oldDateStr,
        dayNumber: historyLog.length + 1,
        dayName: dateInfo.dayName,
        gregorianDate: dateInfo.gregorian,
        hijriDate: dateInfo.hijri,
        percentage,
        completedCount,
        totalCount,
      };

      const updatedHistory = await StorageService.logCompletedDay(dayRecord);
      setHistoryLog(updatedHistory);

      // Reset for new day
      const freshTasks = { ...DEFAULT_TASKS };
      await StorageService.saveDailyTasks(newDateStr, freshTasks);
      setDailyTasks(freshTasks);
      setCurrentDateStr(newDateStr);
      setAdhkarProgress({});
    } catch (e) {
      console.error('Day rollover error:', e);
    }
  };

  // Prayer times calculated live
  const currentCountry = userProfile?.country || DEFAULT_COUNTRY;
  const prayerData = useMemo(() => {
    return calculatePrayerTimes(currentCountry, now);
  }, [currentCountry, now]);

  // Current theme colors
  const theme = useMemo(() => {
    return getTheme(settings.isDarkMode);
  }, [settings.isDarkMode]);

  // Haptic feedback helper
  const triggerHaptic = useCallback(
    async (type = 'light') => {
      if (!settings.hapticsEnabled) return;
      try {
        if (type === 'light') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (type === 'medium') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (type === 'heavy') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (type === 'success') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (e) {
        // Fallback silently if haptics unsupported
      }
    },
    [settings.hapticsEnabled]
  );

  // Toggle Dark Mode
  const toggleTheme = useCallback(async () => {
    const updated = { ...settings, isDarkMode: !settings.isDarkMode };
    setSettings(updated);
    await StorageService.saveSettings(updated);
    triggerHaptic('light');
  }, [settings, triggerHaptic]);

  // Toggle Haptics
  const toggleHaptics = useCallback(async () => {
    const updated = { ...settings, hapticsEnabled: !settings.hapticsEnabled };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  }, [settings]);

  // Save / Update User Profile
  const saveProfile = useCallback(
    async (name, gender, countryId) => {
      const countryObj = COUNTRIES.find((c) => c.id === countryId) || DEFAULT_COUNTRY;
      const profile = {
        name: name.trim(),
        gender, // 'male' | 'female'
        countryId,
        country: countryObj,
        isOnboarded: true,
      };

      setUserProfile(profile);
      await StorageService.saveUserProfile({
        name: profile.name,
        gender: profile.gender,
        countryId: profile.countryId,
        isOnboarded: true,
      });
      triggerHaptic('success');
    },
    [triggerHaptic]
  );

  // Toggle Task with Strict Time Eligibility
  const toggleDailyTask = useCallback(
    async (taskId) => {
      const isCurrentlyDone = !!dailyTasks[taskId];

      // If unticking, allow it
      if (isCurrentlyDone) {
        const updated = { ...dailyTasks, [taskId]: false };
        setDailyTasks(updated);
        await StorageService.saveDailyTasks(currentDateStr, updated);
        triggerHaptic('light');
        return;
      }

      // If ticking, check prayer eligibility
      const check = checkTaskEligibility(taskId, prayerData, now);
      if (!check.eligible) {
        triggerHaptic('heavy');
        showToast(check.reason, 'warning');
        return;
      }

      // Eligible: mark as completed
      const updated = { ...dailyTasks, [taskId]: true };
      setDailyTasks(updated);
      await StorageService.saveDailyTasks(currentDateStr, updated);
      triggerHaptic('success');

      // Update current day history log dynamically
      const completedCount = Object.values(updated).filter(Boolean).length;
      const totalCount = TASK_KEYS.length;
      const percentage = Math.round((completedCount / totalCount) * 100);
      const dateInfo = formatFullArabicDate(now);

      const dayRecord = {
        dateStr: currentDateStr,
        dayNumber: historyLog.length > 0 ? historyLog.length : 1,
        dayName: dateInfo.dayName,
        gregorianDate: dateInfo.gregorian,
        hijriDate: dateInfo.hijri,
        percentage,
        completedCount,
        totalCount,
      };
      const updatedHistory = await StorageService.logCompletedDay(dayRecord);
      setHistoryLog(updatedHistory);
    },
    [dailyTasks, prayerData, now, currentDateStr, historyLog, triggerHaptic, showToast]
  );

  // Tasbeeh Actions
  const TASBEEH_STEPS = [
    { title: 'سبحان الله', countTarget: 33 },
    { title: 'الحمد لله', countTarget: 33 },
    { title: 'لا إله إلا الله', countTarget: 33 },
    { title: 'الله أكبر', countTarget: 33 },
  ];

  const incrementTasbeeh = useCallback(async () => {
    triggerHaptic('medium');
    const { stepIndex, currentCount, totalCycles } = tasbeehState;
    const currentStep = TASBEEH_STEPS[stepIndex];

    const nextCount = currentCount + 1;
    let nextStepIndex = stepIndex;
    let nextTotalCycles = totalCycles;
    let isCompletedRound = false;

    if (nextCount >= currentStep.countTarget) {
      if (stepIndex < TASBEEH_STEPS.length - 1) {
        nextStepIndex = stepIndex + 1;
        const newState = { stepIndex: nextStepIndex, currentCount: 0, totalCycles: nextTotalCycles };
        setTasbeehState(newState);
        await StorageService.saveTasbeehState(newState);
      } else {
        // Finished all 4 steps!
        nextStepIndex = 0;
        nextTotalCycles = totalCycles + 1;
        isCompletedRound = true;
        const newState = { stepIndex: 0, currentCount: 0, totalCycles: nextTotalCycles };
        setTasbeehState(newState);
        await StorageService.saveTasbeehState(newState);
        triggerHaptic('success');
      }
    } else {
      const newState = { stepIndex, currentCount: nextCount, totalCycles };
      setTasbeehState(newState);
      await StorageService.saveTasbeehState(newState);
    }

    return { isCompletedRound, stepIndex: nextStepIndex };
  }, [tasbeehState, triggerHaptic]);

  const resetTasbeeh = useCallback(async () => {
    const newState = { stepIndex: 0, currentCount: 0, totalCycles: tasbeehState.totalCycles };
    setTasbeehState(newState);
    await StorageService.saveTasbeehState(newState);
    triggerHaptic('light');
  }, [tasbeehState.totalCycles, triggerHaptic]);

  // Adhkar Progress Updates
  const updateAdhkarItemCount = useCallback(
    async (adhkarId, targetCount) => {
      triggerHaptic('light');
      const current = adhkarProgress[adhkarId] || 0;
      const next = current + 1;
      const updated = { ...adhkarProgress, [adhkarId]: next >= targetCount ? targetCount : next };
      setAdhkarProgress(updated);
      await StorageService.saveAdhkarProgress(currentDateStr, updated);

      if (next >= targetCount) {
        triggerHaptic('success');
      }
    },
    [adhkarProgress, currentDateStr, triggerHaptic]
  );

  const resetAdhkar = useCallback(
    async (adhkarIds = []) => {
      const updated = { ...adhkarProgress };
      adhkarIds.forEach((id) => {
        delete updated[id];
      });
      setAdhkarProgress(updated);
      await StorageService.saveAdhkarProgress(currentDateStr, updated);
      triggerHaptic('light');
    },
    [adhkarProgress, currentDateStr, triggerHaptic]
  );

  // Progress calculations
  const dailyProgress = useMemo(() => {
    const completed = Object.values(dailyTasks).filter(Boolean).length;
    const total = TASK_KEYS.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }, [dailyTasks]);

  // Streaks & Stats
  const streakStats = useMemo(() => {
    if (!historyLog || historyLog.length === 0) {
      return { currentStreak: 0, perfectDays: 0, totalDays: 0, completionRate: 0 };
    }

    let perfectDays = historyLog.filter((h) => h.percentage === 100).length;
    let currentStreak = 0;

    // Calculate consecutive active days with > 0%
    for (let i = 0; i < historyLog.length; i++) {
      if (historyLog[i].percentage > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    const totalPercentage = historyLog.reduce((acc, h) => acc + (h.percentage || 0), 0);
    const completionRate = Math.round(totalPercentage / historyLog.length);

    return {
      currentStreak,
      perfectDays,
      totalDays: historyLog.length,
      completionRate,
    };
  }, [historyLog]);

  // Navigation Helper
  const navigateTo = useCallback(
    (tab, subScreen = null) => {
      triggerHaptic('light');
      setActiveTab(tab);
      setActiveSubScreen(subScreen);
    },
    [triggerHaptic]
  );

  // Logout and Full Reset
  const logoutAndResetAll = useCallback(async () => {
    try {
      await StorageService.clearAllData();
      setUserProfile(null);
      setDailyTasks(DEFAULT_TASKS);
      setHistoryLog([]);
      setTasbeehState({ stepIndex: 0, currentCount: 0, totalCycles: 0 });
      setAdhkarProgress({});
      setActiveTab('home');
      setActiveSubScreen(null);
      triggerHaptic('medium');
    } catch (e) {
      console.error('Logout error:', e);
    }
  }, [triggerHaptic]);

  const value = {
    isLoading,
    userProfile,
    settings,
    theme,
    now,
    prayerData,
    dailyTasks,
    dailyProgress,
    historyLog,
    streakStats,
    tasbeehState,
    TASBEEH_STEPS,
    adhkarProgress,
    activeTab,
    activeSubScreen,
    toastMessage,
    showToast,
    saveProfile,
    toggleTheme,
    toggleHaptics,
    toggleDailyTask,
    triggerHaptic,
    incrementTasbeeh,
    resetTasbeeh,
    updateAdhkarItemCount,
    resetAdhkar,
    navigateTo,
    logoutAndResetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
