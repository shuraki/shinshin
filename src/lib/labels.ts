import type {
  Activity,
  Confidence,
  FrameworkType,
  Gender,
  Living,
  Region,
  RegistrationStatus,
  SourceType,
} from './types';

export interface ActivityMeta {
  label: string;
  emoji: string;
  keywords: string;
  chip: string;
  tile: string;
  bar: string;
}

export const ACTIVITIES: Record<Activity, ActivityMeta> = {
  education: {
    label: 'חינוך',
    emoji: '📚',
    keywords: 'חינוך הוראה בית ספר תלמידים',
    chip: 'bg-sky-100 text-sky-800 ring-sky-200',
    tile: 'from-sky-400 to-blue-500',
    bar: 'bg-sky-500',
  },
  youth_mentoring: {
    label: 'הדרכת נוער',
    emoji: '🧭',
    keywords: 'הדרכה מדריכים חניכים נוער תנועה',
    chip: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
    tile: 'from-indigo-400 to-violet-500',
    bar: 'bg-indigo-500',
  },
  at_risk_youth: {
    label: 'נוער בסיכון',
    emoji: '🤝',
    keywords: 'נוער בסיכון נוער במצוקה שכונות',
    chip: 'bg-rose-100 text-rose-800 ring-rose-200',
    tile: 'from-rose-400 to-pink-500',
    bar: 'bg-rose-500',
  },
  special_education: {
    label: 'חינוך מיוחד',
    emoji: '💛',
    keywords: 'חינוך מיוחד צרכים מיוחדים',
    chip: 'bg-amber-100 text-amber-800 ring-amber-200',
    tile: 'from-amber-400 to-orange-500',
    bar: 'bg-amber-500',
  },
  disability_support: {
    label: 'אנשים עם מוגבלויות',
    emoji: '♿',
    keywords: 'מוגבלות מוגבלויות צרכים מיוחדים שילוב הכלה',
    chip: 'bg-orange-100 text-orange-800 ring-orange-200',
    tile: 'from-orange-400 to-red-500',
    bar: 'bg-orange-500',
  },
  agriculture: {
    label: 'חקלאות',
    emoji: '🌾',
    keywords: 'חקלאות חווה שדות משק',
    chip: 'bg-lime-100 text-lime-800 ring-lime-200',
    tile: 'from-lime-400 to-green-500',
    bar: 'bg-lime-500',
  },
  nature_environment: {
    label: 'טבע וסביבה',
    emoji: '🌿',
    keywords: 'טבע סביבה קיימות אקולוגיה',
    chip: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    tile: 'from-emerald-400 to-teal-500',
    bar: 'bg-emerald-500',
  },
  hiking: {
    label: 'טיולים והדרכת שטח',
    emoji: '🥾',
    keywords: 'טיולים טיול שטח הדרכת טיולים מסלולים',
    chip: 'bg-teal-100 text-teal-800 ring-teal-200',
    tile: 'from-teal-400 to-cyan-500',
    bar: 'bg-teal-500',
  },
  community: {
    label: 'קהילה',
    emoji: '🏘️',
    keywords: 'קהילה קהילתי שכונה התנדבות',
    chip: 'bg-violet-100 text-violet-800 ring-violet-200',
    tile: 'from-violet-400 to-purple-500',
    bar: 'bg-violet-500',
  },
  settlement: {
    label: 'התיישבות',
    emoji: '🏡',
    keywords: 'התיישבות פריפריה קיבוץ מושב יישוב',
    chip: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    tile: 'from-yellow-400 to-amber-500',
    bar: 'bg-yellow-500',
  },
  art_culture: {
    label: 'אמנות ותרבות',
    emoji: '🎨',
    keywords: 'אמנות תרבות מוזיקה תיאטרון',
    chip: 'bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200',
    tile: 'from-fuchsia-400 to-pink-500',
    bar: 'bg-fuchsia-500',
  },
  social_entrepreneurship: {
    label: 'יזמות חברתית',
    emoji: '💡',
    keywords: 'יזמות חברתית שינוי חברתי פרויקטים',
    chip: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
    tile: 'from-cyan-400 to-sky-500',
    bar: 'bg-cyan-500',
  },
  jewish_identity: {
    label: 'זהות יהודית',
    emoji: '✡️',
    keywords: 'יהדות זהות יהודית דתי מסורת',
    chip: 'bg-blue-100 text-blue-800 ring-blue-200',
    tile: 'from-blue-400 to-indigo-500',
    bar: 'bg-blue-500',
  },
  aliyah_integration: {
    label: 'קליטת עלייה',
    emoji: '✈️',
    keywords: 'עלייה עולים קליטה',
    chip: 'bg-sky-100 text-sky-800 ring-sky-200',
    tile: 'from-sky-400 to-cyan-500',
    bar: 'bg-sky-500',
  },
  medical_emergency: {
    label: 'רפואה והצלה',
    emoji: '🚑',
    keywords: 'רפואה הצלה עזרה ראשונה מדא אמבולנס',
    chip: 'bg-red-100 text-red-800 ring-red-200',
    tile: 'from-red-400 to-rose-500',
    bar: 'bg-red-500',
  },
  sports: {
    label: 'ספורט',
    emoji: '⚽',
    keywords: 'ספורט אימון פעילות גופנית',
    chip: 'bg-green-100 text-green-800 ring-green-200',
    tile: 'from-green-400 to-emerald-500',
    bar: 'bg-green-500',
  },
  coexistence: {
    label: 'חיים משותפים',
    emoji: '🕊️',
    keywords: 'חיים משותפים יהודים ערבים שותפות דו קיום',
    chip: 'bg-purple-100 text-purple-800 ring-purple-200',
    tile: 'from-purple-400 to-fuchsia-500',
    bar: 'bg-purple-500',
  },
};

export const REGIONS: Record<Region, string> = {
  north: 'צפון',
  haifa_valley: 'חיפה והעמקים',
  center: 'מרכז',
  jerusalem: 'ירושלים',
  lowlands: 'שפלה',
  south: 'דרום',
  national: 'בכל הארץ',
};

export const LIVING: Record<Living, string> = {
  commune: 'קומונה (מגורים משותפים)',
  commuter: 'מגורים בבית',
  youth_village: 'כפר נוער',
  boarding_facility: 'פנימייה',
  mixed: 'משתנה לפי מסלול',
  unknown: 'לא ידוע',
};

export const LIVING_SHORT: Record<Living, string> = {
  commune: 'קומונה',
  commuter: 'מהבית',
  youth_village: 'כפר נוער',
  boarding_facility: 'פנימייה',
  mixed: 'משתנה',
  unknown: 'לא ידוע',
};

export const GENDER: Record<Gender, string> = {
  mixed: 'קבוצות מעורבות',
  boys_only: 'בנים בלבד',
  girls_only: 'בנות בלבד',
  varies: 'משתנה לפי גרעין',
  unknown: 'לא ידוע',
};

export const FRAMEWORK: Record<FrameworkType, string> = {
  youth_movement: 'תנועת נוער',
  settlement_movement: 'תנועה התיישבותית',
  social_organization: 'ארגון חברתי',
  other: 'אחר',
};

export const REGISTRATION: Record<RegistrationStatus, { label: string; className: string }> = {
  open: { label: 'ההרשמה פתוחה', className: 'bg-emerald-100 text-emerald-800 ring-emerald-200' },
  coming_soon: { label: 'ההרשמה תיפתח בקרוב', className: 'bg-amber-100 text-amber-800 ring-amber-200' },
  closed: { label: 'ההרשמה סגורה', className: 'bg-slate-100 text-slate-600 ring-slate-200' },
  unknown: { label: 'מועדי הרשמה לא פורסמו', className: 'bg-slate-100 text-slate-600 ring-slate-200' },
};

export const CONFIDENCE: Record<Confidence, { label: string; hint: string; className: string }> = {
  high: {
    label: 'מידע מאומת',
    hint: 'רוב הפרטים נבדקו מול אתר הארגון או מקור ממשלתי',
    className: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  medium: {
    label: 'מאומת חלקית',
    hint: 'חלק מהפרטים לא מופיעים באתר הארגון ולכן לא אומתו',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  low: {
    label: 'מידע חלקי',
    hint: 'מצאנו מעט מידע רשמי. כדאי לברר ישירות מול הארגון',
    className: 'bg-rose-50 text-rose-800 ring-rose-200',
  },
};

export const SOURCE_TYPE: Record<SourceType, string> = {
  official: 'אתר הארגון',
  government: 'מקור ממשלתי',
  secondary: 'מקור משני',
};

export function triLabel(value: boolean | 'unknown', yes: string, no: string): string {
  if (value === 'unknown') return 'לא ידוע';
  return value ? yes : no;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}
