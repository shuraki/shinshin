'use client';

import Link from 'next/link';
import { useCompare } from './compare-store';
import { ACTIVITIES, CONFIDENCE, GENDER, LIVING, REGISTRATION, triLabel } from '@/lib/labels';
import type { Program } from '@/lib/types';
import { regionSummary } from './ProgramCard';

type Row = { label: string; render: (p: Program) => React.ReactNode };

const UNKNOWN = <span className="text-slate-400">לא ידוע</span>;

const ROWS: Row[] = [
  {
    label: 'תחומים',
    render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.activities.map((a) => (
          <span key={a} className={`chip ring-1 ring-inset ${ACTIVITIES[a].chip}`}>
            {ACTIVITIES[a].label}
          </span>
        ))}
      </div>
    ),
  },
  { label: 'איפה', render: (p) => (p.locations.length ? p.locations.join(', ') : p.regions.length ? regionSummary(p) : UNKNOWN) },
  { label: 'מגורים', render: (p) => (p.living === 'unknown' ? UNKNOWN : LIVING[p.living]) },
  { label: 'הרכב הקבוצות', render: (p) => (p.gender === 'unknown' ? UNKNOWN : GENDER[p.gender]) },
  { label: 'אופי דתי', render: (p) => p.religious_character ?? <span className="text-slate-400">הארגון לא מציין</span> },
  {
    label: 'מי יכול להצטרף',
    render: (p) =>
      p.eligibility ??
      (p.membership_required === 'unknown' ? UNKNOWN : triLabel(p.membership_required, 'רק חברי התנועה', 'פתוח גם למי שלא בתנועה')),
  },
  { label: 'מסלול נח"ל', render: (p) => (p.nahal_option === 'unknown' ? UNKNOWN : triLabel(p.nahal_option, 'יש', 'אין')) },
  { label: 'דמי כיס ותנאים', render: (p) => p.stipend ?? <span className="text-slate-400">לא פורסם</span> },
  {
    label: 'הרשמה',
    render: (p) => (
      <span className={`chip ring-1 ring-inset ${REGISTRATION[p.registration.status].className}`}>{REGISTRATION[p.registration.status].label}</span>
    ),
  },
  { label: 'תהליך המיון', render: (p) => p.selection ?? <span className="text-slate-400">לא פורסם</span> },
  {
    label: 'רמת האימות',
    render: (p) => <span className={`chip ring-1 ring-inset ${CONFIDENCE[p.confidence].className}`}>{CONFIDENCE[p.confidence].label}</span>,
  },
];

export function CompareView({ programs }: { programs: Program[] }) {
  const { ids, remove, clear } = useCompare();
  const selected = ids.map((id) => programs.find((p) => p.id === id)).filter((p): p is Program => Boolean(p));

  if (selected.length === 0) {
    return (
      <div className="mt-8 animate-fade-up rounded-3xl border-2 border-dashed border-brand-200 bg-white p-10 text-center">
        <p className="text-5xl" aria-hidden>
          ⚖️
        </p>
        <p className="mt-4 text-xl font-bold text-ink">עוד לא בחרתם תוכניות להשוואה</p>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          ברשימת שנות השירות, לחצו על &quot;להשוואה&quot; ליד 2 עד 4 תוכניות, והן יופיעו כאן אחת ליד השנייה.
        </p>
        <Link href="/programs" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 font-bold text-white shadow-md hover:bg-brand-700">
          לרשימת שנות השירות
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-600">
          {selected.length === 1 ? 'בחרתם תוכנית אחת. הוסיפו עוד אחת לפחות כדי להשוות.' : `משווים ${selected.length} תוכניות.`}
        </p>
        <div className="flex gap-2">
          {selected.length < 4 && (
            <Link href="/programs" className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50">
              + הוספת תוכנית
            </Link>
          )}
          <button type="button" onClick={clear} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
            ניקוי ההשוואה
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl bg-white shadow-lg shadow-brand-900/5 ring-1 ring-slate-200/70">
        <table className="w-full min-w-[640px] border-collapse text-right text-sm">
          <caption className="sr-only">השוואה בין התוכניות שנבחרו</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky right-0 z-10 w-28 bg-white p-4 align-bottom text-slate-500 sm:w-40">
                <span className="sr-only">נושא</span>
              </th>
              {selected.map((p) => {
                const main = ACTIVITIES[p.activities[0] ?? 'community'];
                return (
                  <th key={p.id} scope="col" className="min-w-48 p-4 align-top">
                    <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-l ${main.tile}`} />
                    <Link href={`/programs/${p.id}`} className="text-base font-extrabold text-ink hover:text-brand-700">
                      {p.org.name}
                    </Link>
                    <p className="font-normal text-slate-500">{p.name}</p>
                    <button type="button" onClick={() => remove(p.id)} className="mt-2 text-xs font-semibold text-slate-400 hover:text-rose-600">
                      הסרה ×
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? 'bg-brand-50/40' : ''}>
                <th scope="row" className={`sticky right-0 z-10 p-4 font-bold text-slate-600 ${i % 2 === 0 ? 'bg-[#f8f6ff]' : 'bg-white'}`}>
                  {row.label}
                </th>
                {selected.map((p) => (
                  <td key={p.id} className="p-4 align-top leading-relaxed text-slate-800">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="sticky right-0 z-10 bg-white p-4" />
              {selected.map((p) => {
                const link = p.registration_url ?? p.program_url ?? p.org.website;
                return (
                  <td key={p.id} className="p-4">
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">
                        {p.registration_url ? 'להרשמה ↗' : 'לאתר ↗'}
                      </a>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
