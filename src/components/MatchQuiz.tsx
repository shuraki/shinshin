'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ACTIVITIES, REGIONS } from '@/lib/labels';
import type { Activity, Program, Region } from '@/lib/types';
import { ProgramCard } from './ProgramCard';

const INTERESTS: { id: string; label: string; emoji: string; activities: Activity[] }[] = [
  { id: 'kids', label: 'לעבוד עם ילדים ובני נוער', emoji: '🧒', activities: ['education', 'youth_mentoring'] },
  { id: 'risk', label: 'לעזור לנוער שקשה לו', emoji: '🤝', activities: ['at_risk_youth'] },
  { id: 'special', label: 'לעבוד עם אנשים עם מוגבלויות', emoji: '💛', activities: ['special_education', 'disability_support'] },
  { id: 'nature', label: 'טבע, טיולים ושטח', emoji: '🌿', activities: ['nature_environment', 'hiking'] },
  { id: 'farm', label: 'חקלאות והתיישבות', emoji: '🌾', activities: ['agriculture', 'settlement'] },
  { id: 'community', label: 'קהילה ושינוי חברתי', emoji: '🏘️', activities: ['community', 'social_entrepreneurship', 'coexistence'] },
  { id: 'jewish', label: 'זהות יהודית', emoji: '✡️', activities: ['jewish_identity'] },
  { id: 'other', label: 'ספורט, רפואה ותרבות', emoji: '⚡', activities: ['sports', 'medical_emergency', 'art_culture', 'aliyah_integration'] },
];

const LIVING_OPTIONS = [
  { id: 'commune', label: 'בקומונה עם עוד חבר׳ה', emoji: '🏠' },
  { id: 'commuter', label: 'להמשיך לגור בבית', emoji: '🛋️' },
  { id: 'any', label: 'לא משנה לי', emoji: '🤷' },
] as const;

const REGION_OPTIONS: Region[] = ['north', 'haifa_valley', 'center', 'jerusalem', 'lowlands', 'south'];

type LivingChoice = (typeof LIVING_OPTIONS)[number]['id'];

interface Scored {
  program: Program;
  score: number;
  reasons: string[];
}

export function MatchQuiz({ programs }: { programs: Program[] }) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [living, setLiving] = useState<LivingChoice | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);

  const results = useMemo<Scored[]>(() => {
    const wanted = new Set(INTERESTS.filter((i) => interests.includes(i.id)).flatMap((i) => i.activities));
    return programs
      .map((p) => {
        let score = 0;
        const reasons: string[] = [];
        const hits = p.activities.filter((a) => wanted.has(a));
        if (hits.length) {
          score += 3 + hits.length;
          reasons.push(...hits.slice(0, 2).map((a) => ACTIVITIES[a].label));
        }
        if (living && living !== 'any' && p.living === living) {
          score += 2;
          reasons.push(living === 'commune' ? 'קומונה' : 'מגורים בבית');
        }
        if (regions.length) {
          if (p.regions.includes('national')) {
            score += 1;
            reasons.push('בכל הארץ');
          } else {
            const r = regions.filter((x) => p.regions.includes(x));
            if (r.length) {
              score += 2;
              reasons.push(REGIONS[r[0]]);
            }
          }
        }
        return { program: p, score, reasons };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [programs, interests, living, regions]);

  const total = 3;

  if (step === total) {
    return (
      <div>
        <div className="animate-fade-up rounded-[2rem] bg-gradient-to-br from-brand-600 via-fuchsia-600 to-coral-500 p-8 text-white shadow-xl shadow-brand-600/20">
          <p className="text-sm font-bold text-white/80">התוצאות שלכם</p>
          <h1 className="mt-1 text-3xl font-extrabold">
            {results.length > 0 ? `${Math.min(results.length, 6)} שנות שירות שכדאי לבדוק קודם` : 'לא מצאנו התאמה מדויקת'}
          </h1>
          <p className="mt-2 max-w-xl text-white/90">
            זו רק נקודת התחלה, לא המלצה. היכנסו לכל תוכנית, קראו מה עושים בה ובדקו באתר הארגון.
          </p>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setInterests([]);
              setLiving(null);
              setRegions([]);
            }}
            className="mt-5 rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur hover:bg-white/30"
          >
            להתחיל מחדש
          </button>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {results.slice(0, 6).map((r, i) => (
              <div key={r.program.id} className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-500">
                  מתאים כי: <span className="text-brand-700">{r.reasons.join(' · ')}</span>
                </p>
                <ProgramCard program={r.program} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-slate-600">
            נסו לבחור יותר תחומים, או{' '}
            <Link href="/programs" className="font-bold text-brand-700 hover:underline">
              עברו על הרשימה המלאה
            </Link>
            .
          </p>
        )}
        {results.length > 6 && (
          <p className="mt-8 text-center">
            <Link href="/programs" className="font-bold text-brand-700 hover:underline">
              לרשימה המלאה של שנות השירות
            </Link>
          </p>
        )}
      </div>
    );
  }

  const canNext = step === 0 ? interests.length > 0 : step === 1 ? living !== null : true;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100">
            <div className={`h-full rounded-full bg-gradient-to-l from-brand-500 to-fuchsia-500 transition-all duration-500 ${i <= step ? 'w-full' : 'w-0'}`} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-500">
        שאלה {step + 1} מתוך {total}
      </p>

      <div key={step} className="animate-fade-up">
        {step === 0 && (
          <Question title="מה הכי מושך אתכם?" hint="אפשר לבחור כמה תשובות">
            <div className="grid gap-3 sm:grid-cols-2">
              {INTERESTS.map((o) => (
                <Option
                  key={o.id}
                  emoji={o.emoji}
                  label={o.label}
                  selected={interests.includes(o.id)}
                  onClick={() => setInterests((s) => (s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id]))}
                />
              ))}
            </div>
          </Question>
        )}
        {step === 1 && (
          <Question title="איפה הייתם רוצים לגור בשנה הזאת?">
            <div className="grid gap-3">
              {LIVING_OPTIONS.map((o) => (
                <Option key={o.id} emoji={o.emoji} label={o.label} selected={living === o.id} onClick={() => setLiving(o.id)} />
              ))}
            </div>
          </Question>
        )}
        {step === 2 && (
          <Question title="באיזה אזור?" hint="אפשר לבחור כמה אזורים, או לדלג אם זה לא משנה">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {REGION_OPTIONS.map((r) => (
                <Option
                  key={r}
                  label={REGIONS[r]}
                  selected={regions.includes(r)}
                  onClick={() => setRegions((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]))}
                />
              ))}
            </div>
          </Question>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`rounded-full px-5 py-3 font-semibold text-slate-600 hover:bg-white ${step === 0 ? 'invisible' : ''}`}
        >
          → הקודם
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setStep((s) => s + 1)}
          className="rounded-full bg-gradient-to-l from-brand-600 to-fuchsia-600 px-7 py-3 font-bold text-white shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
        >
          {step === total - 1 ? (regions.length ? 'להצגת התוצאות' : 'דילוג והצגת התוצאות') : 'הבא ←'}
        </button>
      </div>
    </div>
  );
}

function Question({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-6 min-w-0">
      <legend className="text-3xl font-extrabold text-ink">{title}</legend>
      {hint && <p className="mt-1 text-slate-500">{hint}</p>}
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function Option({ emoji, label, selected, onClick }: { emoji?: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-2xl p-4 text-right text-base font-bold transition-all active:scale-[0.98] ${
        selected
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 ring-2 ring-brand-600'
          : 'bg-white text-ink ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-brand-300'
      }`}
    >
      {emoji && (
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl ${selected ? 'bg-white/20' : 'bg-brand-50'}`} aria-hidden>
          {emoji}
        </span>
      )}
      <span className="flex-1">{label}</span>
      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-xs ${selected ? 'animate-pop bg-white text-brand-700' : 'ring-2 ring-slate-200'}`}
        aria-hidden
      >
        {selected ? '✓' : ''}
      </span>
    </button>
  );
}
