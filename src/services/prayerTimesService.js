import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes, Qibla } from 'adhan';

export const PRAYER_NAMES_AR = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
  none: 'الفجر',
};

export const getCalculationParameters = (methodName) => {
  switch (methodName) {
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'Singapore':
      return CalculationMethod.Singapore();
    case 'Turkey':
      return CalculationMethod.Turkey ? CalculationMethod.Turkey() : CalculationMethod.MuslimWorldLeague();
    case 'NorthAmerica':
      return CalculationMethod.NorthAmerica();
    case 'MuslimWorldLeague':
    default:
      return CalculationMethod.MuslimWorldLeague();
  }
};

export const formatArabicTime = (date) => {
  if (!date || isNaN(date.getTime())) return '--:--';
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const period = isPM ? 'م' : 'ص';

  return `${paddedHours}:${paddedMinutes} ${period}`;
};

export const formatDuration = (totalSeconds) => {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');

  return `${hStr}:${mStr}:${sStr}`;
};

export const calculatePrayerTimes = (country, targetDate = new Date()) => {
  try {
    const lat = country?.lat || 31.9539;
    const lng = country?.lng || 35.9106;
    const coordinates = new Coordinates(lat, lng);
    const params = getCalculationParameters(country?.method);

    const prayerTimes = new PrayerTimes(coordinates, targetDate, params);

    // Also get tomorrow's Fajr for countdown calculation when past Isha
    const tomorrow = new Date(targetDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);

    const now = targetDate;
    const list = [
      { id: 'fajr', key: 'fajr', name: 'صلاة الفجر', time: prayerTimes.fajr, formatted: formatArabicTime(prayerTimes.fajr) },
      { id: 'sunrise', key: 'sunrise', name: 'الشروق', time: prayerTimes.sunrise, formatted: formatArabicTime(prayerTimes.sunrise) },
      { id: 'duhur', key: 'dhuhr', name: 'صلاة الظهر', time: prayerTimes.dhuhr, formatted: formatArabicTime(prayerTimes.dhuhr) },
      { id: 'asr', key: 'asr', name: 'صلاة العصر', time: prayerTimes.asr, formatted: formatArabicTime(prayerTimes.asr) },
      { id: 'maghrib', key: 'maghrib', name: 'صلاة المغرب', time: prayerTimes.maghrib, formatted: formatArabicTime(prayerTimes.maghrib) },
      { id: 'eshaa', key: 'isha', name: 'صلاة العشاء', time: prayerTimes.isha, formatted: formatArabicTime(prayerTimes.isha) },
    ];

    // Determine current prayer period & next prayer
    let currentPrayerKey = 'eshaa'; // Default night
    let nextPrayerItem = { id: 'fajr', key: 'fajr', name: 'صلاة الفجر', time: tomorrowPrayerTimes.fajr };

    if (now < prayerTimes.fajr) {
      currentPrayerKey = 'eshaa';
      nextPrayerItem = list[0]; // Fajr today
    } else if (now >= prayerTimes.fajr && now < prayerTimes.dhuhr) {
      currentPrayerKey = 'fajr';
      nextPrayerItem = list[2]; // Dhuhr
    } else if (now >= prayerTimes.dhuhr && now < prayerTimes.asr) {
      currentPrayerKey = 'duhur';
      nextPrayerItem = list[3]; // Asr
    } else if (now >= prayerTimes.asr && now < prayerTimes.maghrib) {
      currentPrayerKey = 'asr';
      nextPrayerItem = list[4]; // Maghrib
    } else if (now >= prayerTimes.maghrib && now < prayerTimes.isha) {
      currentPrayerKey = 'maghrib';
      nextPrayerItem = list[5]; // Isha
    } else {
      // Past Isha
      currentPrayerKey = 'eshaa';
      nextPrayerItem = { id: 'fajr', key: 'fajr', name: 'صلاة الفجر', time: tomorrowPrayerTimes.fajr };
    }

    // Time remaining to next prayer
    const remainingMs = Math.max(0, nextPrayerItem.time.getTime() - now.getTime());
    const remainingSeconds = Math.floor(remainingMs / 1000);
    const countdownFormatted = formatDuration(remainingSeconds);

    // Qibla direction
    const qiblaDirection = Qibla(coordinates);

    return {
      times: list,
      raw: prayerTimes,
      currentPrayerKey, // 'fajr' | 'duhur' | 'asr' | 'maghrib' | 'eshaa'
      nextPrayer: {
        id: nextPrayerItem.id,
        name: nextPrayerItem.name,
        time: nextPrayerItem.time,
        formattedTime: formatArabicTime(nextPrayerItem.time),
        remainingSeconds,
        countdownFormatted,
      },
      qiblaDirection: Math.round(qiblaDirection),
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    return {
      times: [],
      currentPrayerKey: 'duhur',
      nextPrayer: { id: 'asr', name: 'صلاة العصر', remainingSeconds: 0, countdownFormatted: '00:00:00' },
      qiblaDirection: 180,
    };
  }
};

/**
 * Checks if a specific daily task is allowed to be checked at the current moment
 */
export const checkTaskEligibility = (taskId, prayerTimesData, now = new Date()) => {
  if (!prayerTimesData || !prayerTimesData.times || prayerTimesData.times.length === 0) {
    return { eligible: true };
  }

  const times = {};
  prayerTimesData.times.forEach((t) => {
    times[t.id] = t.time;
  });

  switch (taskId) {
    case 'fajr':
      if (times.fajr && now < times.fajr) {
        return {
          eligible: false,
          reason: `لا يمكنك تسجيل صلاة الفجر قبل حلول وقتها (${formatArabicTime(times.fajr)})`,
        };
      }
      return { eligible: true };

    case 'morningAdhkar':
      if (times.fajr && now < times.fajr) {
        return {
          eligible: false,
          reason: `أذكار الصباح تبدأ من بعد أذان الفجر (${formatArabicTime(times.fajr)})`,
        };
      }
      return { eligible: true };

    case 'quran':
      return { eligible: true }; // Quran available all day

    case 'duhur':
      if (times.duhur && now < times.duhur) {
        return {
          eligible: false,
          reason: `لا يمكنك تسجيل صلاة الظهر قبل حلول وقتها (${formatArabicTime(times.duhur)})`,
        };
      }
      return { eligible: true };

    case 'asr':
      if (times.asr && now < times.asr) {
        return {
          eligible: false,
          reason: `لا يمكنك تسجيل صلاة العصر قبل حلول وقتها (${formatArabicTime(times.asr)})`,
        };
      }
      return { eligible: true };

    case 'eveningAdhkar':
      if (times.asr && now < times.asr) {
        return {
          eligible: false,
          reason: `أذكار المساء تبدأ من بعد صلاة العصر (${formatArabicTime(times.asr)})`,
        };
      }
      return { eligible: true };

    case 'maghrib':
      if (times.maghrib && now < times.maghrib) {
        return {
          eligible: false,
          reason: `لا يمكنك تسجيل صلاة المغرب قبل حلول وقتها (${formatArabicTime(times.maghrib)})`,
        };
      }
      return { eligible: true };

    case 'eshaa':
      if (times.eshaa && now < times.eshaa) {
        return {
          eligible: false,
          reason: `لا يمكنك تسجيل صلاة العشاء قبل حلول وقتها (${formatArabicTime(times.eshaa)})`,
        };
      }
      return { eligible: true };

    case 'eveningIstighfar':
      if (times.asr && now < times.asr) {
        return {
          eligible: false,
          reason: `الاستغفار المسائي يبدأ في وقت المساء بعد العصر (${formatArabicTime(times.asr)})`,
        };
      }
      return { eligible: true };

    default:
      return { eligible: true };
  }
};
