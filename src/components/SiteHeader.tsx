'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCompare } from './compare-store';

const NAV = [
  { href: '/programs', label: 'כל שנות השירות' },
  { href: '/match', label: 'עזרה בבחירה' },
  { href: '/about', label: 'מה זה שנת שירות?' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { ids } = useCompare();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
      pathname.startsWith(href) ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-white hover:text-brand-700'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-paper/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 via-fuchsia-500 to-coral-500 text-lg text-white shadow-md shadow-brand-500/30 transition-transform group-hover:rotate-6 group-hover:scale-105">
            ✦
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">שנה הבאה</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="ניווט ראשי">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={linkClass(n.href)}>
              {n.label}
            </Link>
          ))}
          <CompareLink count={ids.length} active={pathname.startsWith('/compare')} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CompareLink count={ids.length} active={pathname.startsWith('/compare')} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-brand-100 bg-paper px-4 pb-4 pt-2 md:hidden" aria-label="ניווט ראשי">
          <ul className="flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className={`block ${linkClass(n.href)}`}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function CompareLink({ count, active }: { count: number; active: boolean }) {
  return (
    <Link
      href="/compare"
      className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
        active ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-white hover:text-brand-700'
      }`}
    >
      השוואה
      {count > 0 && (
        <span key={count} className="grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-coral-500 px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
