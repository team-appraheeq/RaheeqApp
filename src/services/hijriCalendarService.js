export const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const GREGORIAN_MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

/**
 * Robust mathematical Kuweit / Astronomical calculation algorithm for Hijri Date
 */
export const gregorianToHijri = (date = new Date()) => {
  try {
    // Try native Intl first
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
      const parts = formatter.formatToParts(date);
      let hDay = 1, hMonth = 1, hYear = 1448;
      parts.forEach((p) => {
        if (p.type === 'day') hDay = parseInt(p.value, 10);
        if (p.type === 'month') hMonth = parseInt(p.value, 10);
        if (p.type === 'year') hYear = parseInt(p.value, 10);
      });

      if (hMonth >= 1 && hMonth <= 12) {
        return {
          day: hDay,
          month: hMonth,
          monthName: HIJRI_MONTHS_AR[hMonth - 1],
          year: hYear,
          formatted: `${hDay} ${HIJRI_MONTHS_AR[hMonth - 1]} ${hYear} هـ`,
        };
      }
    }
  } catch (e) {
    // Fallback to mathematical algorithm below
  }

  // Kuwaiti Algorithm Fallback
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  let jd;
  if (y > 1582 || (y === 1582 && m > 9) || (y === 1582 && m === 9 && d > 14)) {
    jd =
      Math.floor((1461 * (y + 4800 + Math.floor((m - 13) / 12))) / 4) +
      Math.floor((367 * (m - 1 - 12 * Math.floor((m - 13) / 12))) / 12) -
      Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 13) / 12)) / 100)) / 4) +
      d -
      32075;
  } else {
    jd =
      367 * y -
      Math.floor((7 * (y + 5001 + Math.floor((m - 8) / 12))) / 4) +
      Math.floor((275 * (m + 1)) / 9) +
      d +
      1729777;
  }

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const validMonth = Math.min(12, Math.max(1, month));
  return {
    day,
    month: validMonth,
    monthName: HIJRI_MONTHS_AR[validMonth - 1],
    year,
    formatted: `${day} ${HIJRI_MONTHS_AR[validMonth - 1]} ${year} هـ`,
  };
};

export const formatFullArabicDate = (date = new Date()) => {
  const dayName = ARABIC_DAYS[date.getDay()];
  const gDay = date.getDate();
  const gMonth = GREGORIAN_MONTHS_AR[date.getMonth()];
  const gYear = date.getFullYear();

  const hijri = gregorianToHijri(date);

  return {
    dayName,
    gregorian: `${gDay} ${gMonth} ${gYear} م`,
    gregorianShort: `${gDay}/${date.getMonth() + 1}/${gYear}`,
    hijri: hijri.formatted,
    hijriDay: hijri.day,
    hijriMonthName: hijri.monthName,
    hijriYear: hijri.year,
  };
};

/**
 * Islamic Occasions with accurate calculations
 */
export const getIslamicOccasionsCountdown = (now = new Date()) => {
  // Estimated astronomical anchor dates for major Islamic occasions (2026 - 2030)
  const occasionsData = [
    {
      id: 'ramadan',
      title: 'شهر رمضان المبارك',
      subtitle: 'شهر الرحمة والمغفرة والعتق من النيران',
      icon: 'moon',
      dates: [
        new Date('2026-02-18T00:00:00'),
        new Date('2027-02-08T00:00:00'),
        new Date('2028-01-28T00:00:00'),
        new Date('2029-01-16T00:00:00'),
        new Date('2030-01-06T00:00:00'),
      ],
    },
    {
      id: 'eid_fitr',
      title: 'عيد الفطر السعيد',
      subtitle: 'جائزة الصائمين وفرحة إتمام الشهر الفضيل',
      icon: 'sparkles',
      dates: [
        new Date('2026-03-20T00:00:00'),
        new Date('2027-03-10T00:00:00'),
        new Date('2028-02-27T00:00:00'),
        new Date('2029-02-15T00:00:00'),
        new Date('2030-02-05T00:00:00'),
      ],
    },
    {
      id: 'eid_adha',
      title: 'عيد الأضحى المبارك',
      subtitle: 'يوم الحج الأكبر وذكرى التضحية والفداء',
      icon: 'gift',
      dates: [
        new Date('2026-05-27T00:00:00'),
        new Date('2027-05-17T00:00:00'),
        new Date('2028-05-05T00:00:00'),
        new Date('2029-04-24T00:00:00'),
        new Date('2030-04-14T00:00:00'),
      ],
    },
    {
      id: 'mawlid',
      title: 'المولد النبوي الشريف',
      subtitle: 'ذكرى مولد خير الأنام سيدنا محمد ﷺ',
      icon: 'star',
      dates: [
        new Date('2026-08-26T00:00:00'),
        new Date('2027-08-16T00:00:00'),
        new Date('2028-08-04T00:00:00'),
        new Date('2029-07-24T00:00:00'),
        new Date('2030-07-14T00:00:00'),
      ],
    },
  ];

  return occasionsData.map((occ) => {
    // Find next upcoming date
    let target = occ.dates.find((d) => d.getTime() > now.getTime());
    if (!target) {
      // If beyond list, calculate approx +354 days from last
      const last = occ.dates[occ.dates.length - 1];
      target = new Date(last.getTime() + 354 * 24 * 60 * 60 * 1000);
    }

    const diffMs = Math.max(0, target.getTime() - now.getTime());
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      id: occ.id,
      title: occ.title,
      subtitle: occ.subtitle,
      targetDate: target,
      days,
      hours,
      minutes,
      seconds,
      formattedCountdown: `${days} يوم و ${hours} ساعة و ${minutes} دقيقة`,
    };
  });
};

/**
 * Generate full month days for 2026 - 2050 calendar
 */
export const generateCalendarMonth = (year, monthIndex, today = new Date()) => {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  const days = [];

  // Padding previous month days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    const hijri = gregorianToHijri(prevDate);
    days.push({
      date: prevDate,
      dayNumber: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthName,
      isFriday: prevDate.getDay() === 5,
      isWhiteDay: hijri.day >= 13 && hijri.day <= 15,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const currDate = new Date(year, monthIndex, d);
    const isToday =
      currDate.getFullYear() === today.getFullYear() &&
      currDate.getMonth() === today.getMonth() &&
      currDate.getDate() === today.getDate();

    const hijri = gregorianToHijri(currDate);

    days.push({
      date: currDate,
      dayNumber: d,
      isCurrentMonth: true,
      isToday,
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthName,
      isFriday: currDate.getDay() === 5,
      isWhiteDay: hijri.day >= 13 && hijri.day <= 15,
    });
  }

  // Padding next month days to complete 35 or 42 grid slots
  const remaining = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nextDate = new Date(year, monthIndex + 1, n);
    const hijri = gregorianToHijri(nextDate);
    days.push({
      date: nextDate,
      dayNumber: n,
      isCurrentMonth: false,
      isToday: false,
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthName,
      isFriday: nextDate.getDay() === 5,
      isWhiteDay: hijri.day >= 13 && hijri.day <= 15,
    });
  }

  return days;
};
