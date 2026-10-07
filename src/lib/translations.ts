// Hebrew translations for enums and field names
export const translations = {
  frameType: {
    youth_movement: 'תנועת נוער',
    settlement_movement: 'תנועת התיישבות',
    social_organization: 'ארגון חברתי',
    nature_education: 'חינוך טבעי',
    sports: 'ספורט',
    religious: 'דתי',
    other: 'אחר',
  },

  activityCategory: {
    education: 'חינוך',
    youth_mentoring: 'הדרכת נוער',
    at_risk_youth: 'נוער בסיכון',
    special_education: 'חינוך מיוחד',
    disability_support: 'תמיכה לאנשים עם מוגבלויות',
    agriculture: 'חקלאות',
    nature_environment: 'טבע וסביבה',
    hiking: 'טיולים והדרכה',
    community: 'קהילה',
    settlement: 'התיישבות',
    art_culture: 'אמנות ותרבות',
    social_entrepreneurship: 'יזמות חברתית',
    jewish_identity: 'זהות יהודית',
    aliyah_integration: 'קליטת עלייה',
    medical_emergency: 'רפואה וחירום',
    other: 'אחר',
  },

  region: {
    north: 'צפון',
    haifa_valley: 'חיפה והעמקים',
    center: 'מרכז',
    jerusalem: 'ירושלים',
    lowlands: 'שפלה',
    south: 'דרום',
    national: 'ארצי',
  },

  livingArrangement: {
    commune: 'קומונה (חיים משותפים)',
    commuter: 'קומוטר (חיים בבית)',
    youth_village: 'כפר נוער',
    boarding_facility: 'פנימייה',
    unknown: 'לא ידוע',
  },

  genderStructure: {
    mixed: 'מעורב (בנים וילדות)',
    boys_only: 'בנים בלבד',
    girls_only: 'בנות בלבד',
    unknown: 'לא ידוע',
  },

  cycleStatus: {
    open: 'פתוח להרשמה',
    closed: 'סגור',
    coming_soon: 'בקרוב',
    unknown: 'לא ידוע',
  },

  verificationStatus: {
    verified: 'מאומת',
    partially_verified: 'מאומת חלקית',
    needs_review: 'דורש בדיקה',
    stale: 'דעכן',
  },

  confidenceLevel: {
    high: 'ביטחון גבוה',
    medium: 'ביטחון בינוני',
    low: 'ביטחון נמוך',
    unknown: 'לא ידוע',
  },

  sourceType: {
    official: 'אתר רשמי',
    official_registration_page: 'עמוד הרשמה רשמי',
    social_media: 'רשתות חברתיות',
    news: 'כתבה חדשותית',
    aggregator: 'אתר אגרגטור',
    user_report: 'דיווח משתמש',
  },
};

export function translate(
  type: 'frameType' | 'activityCategory' | 'region' | 'livingArrangement' | 'genderStructure' | 'cycleStatus' | 'verificationStatus' | 'confidenceLevel' | 'sourceType',
  value: string
): string {
  const dict = translations[type] as Record<string, string>;
  return dict[value] || value;
}
