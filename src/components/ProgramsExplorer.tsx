'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ACTIVITIES, LIVING_SHORT, REGIONS } from '@/lib/labels';
import { buildIndex, search } from '@/lib/search';
import type { Activity, Living, Program, Region } from '@/lib/types';
import { ProgramCard } from './ProgramCard';

const REGION_FILTERS: Region[] = ['north', 'haifa_valley', 'center', 'jerusalem', 'lowlands', 'south'];
const LIVING_FILTERS: Living[] = ['commune', 'commuter'];

function parseList<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) return [];
  return value.split(',').filter((v): v is T => (allowed as readonly string[]).includes(v));
}

export function ProgramsExplorer({ programs }: { programs: Program[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const usedActivities = useMemo(
    () => (Object.keys(ACTIVITIES) as Activity[]).filter((a) => programs.some((p) => p.activities.includes(a))),
    [programs],
  );

  const [query, setQuery] = useState(params.get('q') ?? '');
  const cats = parseList(params.get('cat'), usedActivities);
  const regions = parseList(params.get('region'), REGION_FILTERS);
  const living = parseList(params.get('living'), LIVING_FILTERS);

  const index = useMemo(() => buildIndex(programs), [programs]);

  const results = useMemo(() => {
    return search(index, query).filter(
      (p) =>
        (cats.length === 0 || cats.some((c) => p.activities.includes(c))) &&
        (regions.length === 0 || p.regions.includes('national') || regions.some((r) => p.regions.includes(r))) &&
        (living.length === 0 || living.includes(p.living)),
    );
  }, [index, query, cats, regions, living]);

  function setParam(key: string, values: string[] | string) {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(values) ? values.join(',') : values;
    if (v) next.set(key, v);
    else next.delete(key);
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function toggle<T extends string>(key: string, list: T[], value: T) {
    setParam(key, list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const activeCount = cats.length + regions.length + living.length + (query.trim() ? 1 : 0);

  function reset() {
    setQuery('');
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  return (
    <div>
      <div className="relative">
        <label htmlFor="program-search" className="sr-only">
          חיפוש שנת שירות
        </label>
        <svg className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id="program-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setParam('q', e.target.value.trim());
          }}
          placeholder="שם ארגון, תחום או עיר. למשל: קרמבו, טבע, באר שבע"
          className="h-14 w-full rounded-2xl border-2 border-brand-100 bg-white pe-4 ps-12 text-base shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:shadow-lg focus:shadow-brand-500/10"
          autoComplete="off"
        />
      </div>

      <div className="mt-5 space-y-4">
        <FilterRow title="תחום">
          {usedActivities.map((a) => (
            <FilterChip key={a} active={cats.includes(a)} onClick={() => toggle('cat', cats, a)}>
              <span aria-hidden>{ACTIVITIES[a].emoji}</span> {ACTIVITIES[a].label}
            </FilterChip>
          ))}
        </FilterRow>
        <FilterRow title="אזור">
          {REGION_FILTERS.map((r) => (
            <FilterChip key={r} active={regions.includes(r)} onClick={() => toggle('region', regions, r)}>
              {REGIONS[r]}
            </FilterChip>
          ))}
        </FilterRow>
        <FilterRow title="מגורים">
          {LIVING_FILTERS.map((l) => (
            <FilterChip key={l} active={living.includes(l)} onClick={() => toggle('living', living, l)}>
              {LIVING_SHORT[l]}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
        <p className="text-lg font-bold text-ink">
          {results.length === programs.length ? `${programs.length} שנות שירות` : `נמצאו ${results.length} מתוך ${programs.length}`}
        </p>
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
            ניקוי החיפוש והסינון
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <ProgramCard key={p.id} program={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-brand-200 bg-white p-10 text-center">
          <p className="text-4xl" aria-hidden>
            🔍
          </p>
          <p className="mt-3 text-lg font-bold text-ink">לא מצאנו תוכנית שמתאימה לחיפוש</p>
          <p className="mt-1 text-slate-600">נסו מילה אחרת או הסירו חלק מהסינונים.</p>
          <button type="button" onClick={reset} className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white hover:bg-brand-700">
            הצגת כל התוכניות
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <legend className="sr-only">{title}</legend>
      <span aria-hidden className="w-16 shrink-0 pt-1.5 text-sm font-bold text-slate-500">
        {title}
      </span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">{children}</div>
    </fieldset>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all active:scale-95 ${
        active
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
          : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-brand-50 hover:ring-brand-200'
      }`}
    >
      {children}
    </button>
  );
}
