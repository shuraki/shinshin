'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from './compare-store';
import type { Program } from '@/lib/types';

export function CompareTray({ programs }: { programs: Pick<Program, 'id' | 'org'>[] }) {
  const { ids, remove, clear } = useCompare();
  const pathname = usePathname();
  if (ids.length === 0 || pathname.startsWith('/compare')) return null;

  const selected = ids.map((id) => programs.find((p) => p.id === id)).filter(Boolean) as Pick<Program, 'id' | 'org'>[];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-5">
      <div
        role="region"
        aria-label="תוכניות להשוואה"
        className="pointer-events-auto flex w-full max-w-3xl animate-fade-up flex-wrap items-center gap-2 rounded-2xl border border-brand-200 bg-white/95 p-3 shadow-2xl shadow-brand-900/15 backdrop-blur"
      >
        <span className="me-1 text-sm font-bold text-ink">להשוואה ({ids.length}/4):</span>
        <ul className="flex flex-1 flex-wrap gap-1.5">
          {selected.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="chip bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200 hover:bg-brand-100"
                aria-label={`הסרת ${p.org.name} מההשוואה`}
              >
                {p.org.name}
                <span aria-hidden>×</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" onClick={clear} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
            ניקוי
          </button>
          <Link
            href="/compare"
            aria-disabled={ids.length < 2}
            className={`rounded-full px-5 py-2 text-sm font-bold text-white shadow-md transition-all ${
              ids.length < 2
                ? 'pointer-events-none bg-slate-300'
                : 'bg-gradient-to-l from-brand-600 to-fuchsia-600 hover:-translate-y-0.5 hover:shadow-lg'
            }`}
          >
            {ids.length < 2 ? 'בחרו עוד תוכנית' : 'להשוואה ←'}
          </Link>
        </div>
      </div>
    </div>
  );
}
