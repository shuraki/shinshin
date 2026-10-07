import type { Metadata } from 'next';
import { Assistant, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const assistant = Assistant({
  variable: '--font-hebrew',
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700'],
});

const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'מה עושים בשנה הבאה? - כל שנות השירות במקום אחד',
  description:
    'מאגר שלם וחיפוש של כל תוכניות השירות הלאומי בישראל. גלו, השוו והרשמו לשנת שירות שמתאימה לכם.',
  openGraph: {
    title: 'מה עושים בשנה הבאה?',
    description: 'כל שנות השירות במקום אחד',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${mono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-hebrew">
        {children}
      </body>
    </html>
  );
}
