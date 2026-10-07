import type { Metadata } from 'next';
import { MatchQuiz } from '@/components/MatchQuiz';
import { programs } from '@/lib/data';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'עזרה בבחירת שנת שירות',
  description: 'שלוש שאלות קצרות: מה מעניין אתכם, איפה תרצו לגור ובאיזה אזור. נציג לכם את שנות השירות שכדאי לבדוק קודם.',
  path: '/match',
});

export default function MatchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      <MatchQuiz programs={programs} />
    </div>
  );
}
