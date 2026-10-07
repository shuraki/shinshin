import Link from 'next/link';
import { ACTIVITIES, LIVING_SHORT, REGIONS, REGISTRATION } from '@/lib/labels';
import type { Program } from '@/lib/types';
import { CompareButton } from './CompareButton';

export function regionSummary(p: Program): string {
  if (p.regions.includes('national')) return REGIONS.national;
  if (p.regions.length === 0) return 'לא ידוע';
  return p.regions.map((r) => REGIONS[r]).join(', ');
}

export function ProgramCard({ program: p, index = 0 }: { program: Program; index?: number }) {
  const main = ACTIVITIES[p.activities[0] ?? 'community'];
  const reg = REGISTRATION[p.registration.status];

  return (
    <article
      className="group relative flex animate-fade-up flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10"
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <div className={`h-1.5 bg-gradient-to-l ${main.tile}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${main.tile} text-2xl shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}
            aria-hidden
          >
            {main.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-snug text-ink">
              <Link href={`/programs/${p.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                {p.org.name}
              </Link>
            </h3>
            <p className="truncate text-sm text-slate-500">{p.name}</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-700">{p.tagline}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="תחומים">
          {p.activities.slice(0, 3).map((a) => (
            <li key={a} className={`chip ring-1 ring-inset ${ACTIVITIES[a].chip}`}>
              {ACTIVITIES[a].label}
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">איפה</dt>
            <dd className="truncate font-semibold text-slate-800">{regionSummary(p)}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">מגורים</dt>
            <dd className="font-semibold text-slate-800">{LIVING_SHORT[p.living]}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <span className={`chip ring-1 ring-inset ${reg.className}`}>{reg.label}</span>
          <CompareButton id={p.id} name={p.org.name} />
        </div>
      </div>
    </article>
  );
}
