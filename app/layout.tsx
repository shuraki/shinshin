import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Assistant, Rubik } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import { CompareTray } from '@/components/CompareTray';
import { programs, lastVerified } from '@/lib/data';
import { formatDate } from '@/lib/labels';
import { reportUrl, SITE_URL } from '@/lib/site';
import './globals.css';

const body = Assistant({ variable: '--font-body', subsets: ['hebrew', 'latin'], weight: ['400', '500', '600', '700'] });
const heading = Rubik({ variable: '--font-heading', subsets: ['hebrew', 'latin'], weight: ['500', '700', '800'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'שנה הבאה – כל שנות השירות במקום אחד', template: '%s | שנה הבאה' },
  description:
    'מחפשים שנת שירות (ש"ש) לפני הצבא? כל שנות השירות בישראל במקום אחד: מה עושים בכל תוכנית, איפה גרים, מתי נרשמים ואיך משווים. כל פרט נבדק מול אתר הארגון.',
  applicationName: 'שנה הבאה',
  keywords: ['שנת שירות', 'ש"ש', 'שינשין', 'שנת שירות לפני צבא', 'קומונה', 'גרעין', 'י"ב', 'מה עושים אחרי התיכון', 'התנדבות לפני הגיוס'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'מה עושים בשנה הבאה? כל שנות השירות במקום אחד',
    description: 'חיפוש, סינון והשוואה בין שנות שירות לפני הצבא, עם מקורות רשמיים לכל פרט.',
    type: 'website',
    locale: 'he_IL',
    siteName: 'שנה הבאה',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מה עושים בשנה הבאה? כל שנות השירות במקום אחד',
    description: 'חיפוש, סינון והשוואה בין שנות שירות לפני הצבא, עם מקורות רשמיים לכל פרט.',
  },
};

export const viewport: Viewport = {
  themeColor: '#7444fb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${body.variable} ${heading.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          דילוג לתוכן
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="mt-20 border-t border-brand-100 bg-white pb-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-slate-600 md:grid-cols-3">
            <div>
              <p className="font-display text-lg font-bold text-ink">שנה הבאה</p>
              <p className="mt-2 leading-relaxed">
                אתר עצמאי שמרכז מידע על שנות שירות בישראל. האתר לא קשור לאף אחד מהארגונים המופיעים בו.
              </p>
            </div>
            <div>
              <p className="font-bold text-ink">איך אנחנו בודקים מידע</p>
              <p className="mt-2 leading-relaxed">
                כל פרט מגיע מאתר הארגון או ממקור ממשלתי, עם קישור למקור. מה שלא מצאנו מסומן &quot;לא ידוע&quot;.
                {lastVerified && ` הבדיקה האחרונה: ${formatDate(lastVerified)}.`}
              </p>
              <Link href="/about#method" className="mt-2 inline-block font-semibold text-brand-700 hover:underline">
                עוד על השיטה
              </Link>
            </div>
            <div>
              <p className="font-bold text-ink">מצאתם טעות?</p>
              <p className="mt-2 leading-relaxed">הפרטים משתנים כל שנה. לפני ההרשמה, בדקו תמיד באתר הארגון.</p>
              <a
                href={reportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-brand-700 hover:underline"
              >
                דיווח על טעות
              </a>
            </div>
          </div>
          <div className="border-t border-slate-100 py-5 text-center text-sm text-slate-500">
            נתמך על ידי ״
            <a href="https://basecrm.co.il" target="_blank" rel="noopener" className="font-semibold text-brand-700 hover:underline">
              בייס
            </a>
            ״
          </div>
        </footer>
        <CompareTray programs={programs.map(({ id, org }) => ({ id, org }))} />
      </body>
    </html>
  );
}
