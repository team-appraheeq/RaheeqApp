import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@raheeq_user_profile',
  SETTINGS: '@raheeq_settings',
  DAILY_TASKS: '@raheeq_daily_tasks',
  HISTORY_LOG: '@raheeq_history_log',
  TASBEEH_STATE: '@raheeq_tasbeeh_state',
  ADHKAR_PROGRESS: '@raheeq_adhkar_progress',
};

export const StorageService = {
  // User Profile
  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading user profile:', e);
      return null;
    }
  },

  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Error saving user profile:', e);
      return false;
    }
  },

  // Settings
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : { isDarkMode: false, hapticsEnabled: true };
    } catch (e) {
      return { isDarkMode: false, hapticsEnabled: true };
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Daily Tasks
  async getDailyTasks(dateStr) {
    try {
      const allTasksJson = await AsyncStorage.getItem(KEYS.DAILY_TASKS);
      const allTasks = allTasksJson ? JSON.parse(allTasksJson) : {};
      return allTasks[dateStr] || {
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
    } catch (e) {
      return {
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
    }
  },

  async saveDailyTasks(dateStr, tasks) {
    try {
      const allTasksJson = await AsyncStorage.getItem(KEYS.DAILY_TASKS);
      const allTasks = allTasksJson ? JSON.parse(allTasksJson) : {};
      allTasks[dateStr] = tasks;
      await AsyncStorage.setItem(KEYS.DAILY_TASKS, JSON.stringify(allTasks));
      return true;
    } catch (e) {
      return false;
    }
  },

  // History Log
  async getHistoryLog() {
    try {
      const data = await AsyncStorage.getItem(KEYS.HISTORY_LOG);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async saveHistoryLog(historyArray) {
    try {
      await AsyncStorage.setItem(KEYS.HISTORY_LOG, JSON.stringify(historyArray));
      return true;
    } catch (e) {
      return false;
    }
  },

  async logCompletedDay(dayRecord) {
    try {
      const history = await this.getHistoryLog();
      const existingIndex = history.findIndex((h) => h.dateStr === dayRecord.dateStr);
      if (existingIndex >= 0) {
        history[existingIndex] = dayRecord;
      } else {
        history.unshift(dayRecord);
      }
      await this.saveHistoryLog(history);
      return history;
    } catch (e) {
      return [];
    }
  },

  // Tasbeeh State
  async getTasbeehState() {
    try {
      const data = await AsyncStorage.getItem(KEYS.TASBEEH_STATE);
      return data ? JSON.parse(data) : { stepIndex: 0, currentCount: 0, totalCycles: 0 };
    } catch (e) {
      return { stepIndex: 0, currentCount: 0, totalCycles: 0 };
    }
  },

  async saveTasbeehState(state) {
    try {
      await AsyncStorage.setItem(KEYS.TASBEEH_STATE, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Adhkar Progress
  async getAdhkarProgress(dateStr) {
    try {
      const data = await AsyncStorage.getItem(KEYS.ADHKAR_PROGRESS);
      const all = data ? JSON.parse(data) : {};
      return all[dateStr] || {};
    } catch (e) {
      return {};
    }
  },

  async saveAdhkarProgress(dateStr, progress) {
    try {
      const data = await AsyncStorage.getItem(KEYS.ADHKAR_PROGRESS);
      const all = data ? JSON.parse(data) : {};
      all[dateStr] = progress;
      await AsyncStorage.setItem(KEYS.ADHKAR_PROGRESS, JSON.stringify(all));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Reset all app data (Logout)
  async clearAllData() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  },
};
