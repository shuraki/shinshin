import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProgramsExplorer } from '@/components/ProgramsExplorer';
import { otherFrameworks, programs } from '@/lib/data';
import { pageMeta, SITE_URL } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'כל שנות השירות',
  description: 'רשימת שנות השירות (ש"ש) בישראל: מה עושים בכל תוכנית, איפה, מגורים בקומונה או בבית ומתי נרשמים. עם חיפוש, סינון והשוואה.',
  path: '/programs',
});

export default function ProgramsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'כל שנות השירות',
    numberOfItems: programs.length,
    itemListElement: programs.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.org.name} – ${p.name}`,
      url: `${SITE_URL}/programs/${p.id}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-3xl animate-fade-up">
        <p className="text-sm font-bold text-brand-600">הרשימה המלאה</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">כל שנות השירות</h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          {programs.length} שנות שירות שבדקנו מול אתרי הארגונים. אפשר לחפש, לסנן ולבחור עד 4 תוכניות להשוואה.
          {otherFrameworks.length > 0 && ' בתחתית העמוד מופיעים גם ארגונים נוספים שעדיין לא בדקנו.'}
        </p>
      </header>

      <section className="mt-8" aria-label="חיפוש וסינון">
        <Suspense fallback={<div className="h-14 rounded-2xl bg-white shadow-sm" />}>
          <ProgramsExplorer programs={programs} />
        </Suspense>
      </section>

      {otherFrameworks.length > 0 && (
        <section id="more" className="mt-20 scroll-mt-24" aria-labelledby="more-title">
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-brand-50 p-6 ring-1 ring-amber-100 sm:p-8">
            <h2 id="more-title" className="text-2xl font-extrabold text-ink">
              ארגונים נוספים ברשימה הרשמית
            </h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">
              הארגונים האלה מופיעים ברשימת הגופים המוכרים לשנת שירות של משרד הביטחון, אבל עוד לא בדקנו את הפרטים שלהם
              לעומק. כדאי לבדוק באתר הארגון אם יש מחזור פתוח השנה.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherFrameworks.map((o) => (
                <li key={o.name} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
                  <p className="font-bold text-ink">{o.name}</p>
                  {o.note && <p className="mt-1 text-sm leading-relaxed text-slate-600">{o.note}</p>}
                  {o.url ? (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
                    >
                      {o.link_label ?? 'לאתר הארגון'} ↗
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">לא מצאנו אתר רשמי</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
