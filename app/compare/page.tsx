import type { Metadata } from 'next';
import { CompareView } from '@/components/CompareView';
import { programs } from '@/lib/data';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'השוואה בין שנות שירות',
  description: 'השוואה של עד 4 שנות שירות זו לצד זו: תחומים, אזור, מגורים, הרשמה ותנאים.',
  path: '/compare',
  index: false,
});

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="animate-fade-up text-3xl font-extrabold text-ink sm:text-4xl">השוואה בין שנות שירות</h1>
      <CompareView programs={programs} />
    </div>
  );
}
