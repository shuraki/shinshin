import Link from 'next/link';
import { ProgramCard } from '@/components/ProgramCard';
import { otherFrameworks, programs } from '@/lib/data';
import { ACTIVITIES } from '@/lib/labels';
import { SITE_URL } from '@/lib/site';
import type { Activity } from '@/lib/types';

const HOME_CATEGORIES: Activity[] = [
  'education',
  'youth_mentoring',
  'at_risk_youth',
  'disability_support',
  'nature_environment',
  'agriculture',
  'community',
  'coexistence',
  'jewish_identity',
  'sports',
  'medical_emergency',
  'settlement',
];

export default function Home() {
  const categories = HOME_CATEGORIES.map((a) => ({
    a,
    count: programs.filter((p) => p.activities.includes(a)).length,
  })).filter((c) => c.count > 0);

  const openNow = programs.filter((p) => p.registration.status === 'open');
  const featured = [...openNow, ...programs.filter((p) => p.registration.status !== 'open')].slice(0, 6);
  const sourceCount = new Set(programs.flatMap((p) => p.sources.map((s) => s.url))).size;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'שנה הבאה',
    alternateName: 'כל שנות השירות במקום אחד',
    url: SITE_URL,
    inLanguage: 'he-IL',
    description: 'מאגר עצמאי של שנות שירות (ש"ש) בישראל לפני הגיוס, עם חיפוש, סינון, השוואה ומקורות רשמיים לכל פרט.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/programs?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
        <div className="absolute -right-24 -top-24 -z-10 h-96 w-96 animate-float rounded-full bg-brand-400/35 blur-3xl" aria-hidden />
        <div className="absolute -left-20 top-20 -z-10 h-80 w-80 animate-float-slow rounded-full bg-coral-400/30 blur-3xl" aria-hidden />
        <div className="absolute right-1/3 top-64 -z-10 h-72 w-72 animate-float rounded-full bg-sun-300/40 blur-3xl [animation-delay:-6s]" aria-hidden />

        <div className="mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:pt-20">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-brand-700 shadow-sm ring-1 ring-brand-100 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {openNow.length > 0 ? `${openNow.length} תוכניות פתוחות עכשיו להרשמה` : 'מעודכן לשנת ההרשמה הנוכחית'}
          </p>
          <h1 className="mt-6 animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight text-ink [animation-delay:80ms] sm:text-6xl">
            מה עושים <span className="text-gradient">בשנה הבאה?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed text-slate-600 [animation-delay:160ms] sm:text-xl">
            כל שנות השירות במקום אחד: מה עושים בכל אחת, איפה גרים, ומתי נרשמים. כל פרט כאן נבדק מול אתר הארגון.
          </p>

          <form action="/programs" className="relative mx-auto mt-9 max-w-2xl animate-fade-up [animation-delay:240ms]" role="search">
            <label htmlFor="home-search" className="sr-only">
              חיפוש שנת שירות
            </label>
            <div className="group relative rounded-[1.4rem] bg-gradient-to-l from-brand-500 via-fuchsia-500 to-coral-500 p-[2px] shadow-xl shadow-brand-500/20 transition-shadow focus-within:shadow-2xl focus-within:shadow-brand-500/30">
              <div className="flex items-center rounded-[1.3rem] bg-white">
                <svg className="mr-5 h-5 w-5 shrink-0 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder="קרמבו, טבע, קומונה בצפון..."
                  className="h-16 min-w-0 flex-1 bg-transparent px-3 text-lg outline-none placeholder:text-slate-400"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="m-2 rounded-2xl bg-gradient-to-l from-brand-600 to-fuchsia-600 px-5 py-3 font-bold text-white transition-transform hover:scale-[1.03] active:scale-95 sm:px-7"
                >
                  חיפוש
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 flex animate-fade-up flex-wrap justify-center gap-2 [animation-delay:320ms]">
            <Link
              href="/match"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              ✨ עזרה בבחירה: 3 שאלות
            </Link>
            <Link
              href="/programs"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              לרשימה המלאה ←
            </Link>
          </div>

          <dl className="mx-auto mt-12 grid max-w-2xl animate-fade-up grid-cols-3 gap-3 [animation-delay:400ms]">
            {[
              { n: programs.length, l: 'שנות שירות שנבדקו' },
              { n: sourceCount, l: 'מקורות רשמיים' },
              { n: otherFrameworks.length, l: 'ארגונים נוספים ברשימה' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/70 px-2 py-4 shadow-sm ring-1 ring-white backdrop-blur">
                <dt className="text-xs font-semibold text-slate-500 sm:text-sm">{s.l}</dt>
                <dd className="order-first font-display text-3xl font-extrabold text-brand-700">{s.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-6" aria-labelledby="cat-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="cat-title" className="text-2xl font-extrabold text-ink sm:text-3xl">
            במה בא לכם לעסוק?
          </h2>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(({ a, count }, i) => (
            <li key={a} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Link
                href={`/programs?cat=${a}`}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${ACTIVITIES[a].tile} p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <span className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-150" aria-hidden />
                <span className="text-3xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" aria-hidden>
                  {ACTIVITIES[a].emoji}
                </span>
                <span className="mt-3 text-lg font-extrabold leading-tight">{ACTIVITIES[a].label}</span>
                <span className="mt-1 text-sm font-semibold text-white/85">
                  {count === 1 ? 'תוכנית אחת' : `${count} תוכניות`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16" aria-labelledby="featured-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="featured-title" className="text-2xl font-extrabold text-ink sm:text-3xl">
              {openNow.length > 0 ? 'פתוחות עכשיו להרשמה' : 'שנות שירות'}
            </h2>
            <p className="mt-1 text-slate-600">בחרו עד 4 תוכניות והשוו ביניהן.</p>
          </div>
          <Link href="/programs" className="font-bold text-brand-700 hover:underline">
            לכל {programs.length} שנות השירות ←
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProgramCard key={p.id} program={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-brand-700/20 sm:p-12">
          <div className="absolute -left-16 -top-16 h-64 w-64 animate-float rounded-full bg-coral-400/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 right-10 h-56 w-56 animate-float-slow rounded-full bg-sun-300/30 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">לא יודעים מאיפה להתחיל?</h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/90">
                ענו על 3 שאלות קצרות: מה מעניין אתכם, איפה תרצו לגור ובאיזה אזור. נראה לכם את שנות השירות שכדאי לבדוק קודם.
              </p>
            </div>
            <Link
              href="/match"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-extrabold text-brand-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            >
              בואו נתחיל
              <span className="transition-transform group-hover:-translate-x-1" aria-hidden>
                ←
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16" aria-labelledby="what-title">
        <div className="grid gap-6 rounded-[2rem] bg-white p-8 ring-1 ring-slate-200/70 md:grid-cols-[1fr_1fr] md:p-12">
          <div>
            <h2 id="what-title" className="text-2xl font-extrabold text-ink sm:text-3xl">
              רגע, מה זה בכלל שנת שירות?
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">
              שנה של התנדבות לפני הגיוס, לרוב בקבוצה ובקומונה. היא שונה ממכינה קדם-צבאית, שבה רוב הזמן מוקדש ללימוד, ומשירות
              לאומי, שבא במקום השירות הצבאי.
            </p>
            <Link href="/about" className="mt-4 inline-block font-bold text-brand-700 hover:underline">
              המדריך הקצר ←
            </Link>
          </div>
          <ul className="grid gap-3 text-[15px]">
            {[
              ['🔗', 'מקור לכל פרט', 'בכל תוכנית יש קישורים לאתר הארגון ולמקורות רשמיים.'],
              ['❔', 'לא מנחשים', 'מה שלא מצאנו מסומן "לא ידוע", במיוחד בנושאי דת ואורח חיים.'],
              ['📅', 'תאריך בדיקה', 'ליד כל תוכנית מופיע מתי בדקנו אותה לאחרונה.'],
            ].map(([e, t, d]) => (
              <li key={t} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="text-2xl" aria-hidden>
                  {e}
                </span>
                <span>
                  <span className="block font-bold text-ink">{t}</span>
                  <span className="text-slate-600">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
