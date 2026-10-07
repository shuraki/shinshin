import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompareButton } from '@/components/CompareButton';
import { ProgramCard, regionSummary } from '@/components/ProgramCard';
import { getProgram, programs } from '@/lib/data';
import {
  ACTIVITIES,
  CONFIDENCE,
  FRAMEWORK,
  GENDER,
  LIVING,
  REGISTRATION,
  SOURCE_TYPE,
  formatDate,
  triLabel,
} from '@/lib/labels';
import { pageMeta, reportUrl, SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return programs.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<'/programs/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const p = getProgram(id);
  if (!p) return {};
  return pageMeta({
    title: `${p.org.name} – ${p.name}`,
    description: `${p.tagline} מגורים, אזור, הרשמה ותנאים, עם מקורות רשמיים.`,
    path: `/programs/${p.id}`,
  });
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default async function ProgramPage({ params }: PageProps<'/programs/[id]'>) {
  const { id } = await params;
  const p = getProgram(id);
  if (!p) notFound();

  const main = ACTIVITIES[p.activities[0] ?? 'community'];
  const reg = REGISTRATION[p.registration.status];
  const conf = CONFIDENCE[p.confidence];
  const primaryLink = p.registration_url ?? p.program_url ?? p.org.website;
  const primaryLabel = p.registration_url ? 'לעמוד ההרשמה' : p.program_url ? 'לעמוד התוכנית באתר הארגון' : 'לאתר הארגון';

  const similar = programs
    .filter((o) => o.id !== p.id && o.activities.some((a) => p.activities.includes(a)))
    .map((o) => ({ o, score: o.activities.filter((a) => p.activities.includes(a)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.o);

  const facts: { label: string; value: string; muted?: boolean }[] = [
    { label: 'איפה', value: p.locations.length > 0 ? p.locations.join(', ') : regionSummary(p), muted: p.regions.length === 0 && p.locations.length === 0 },
    { label: 'מגורים', value: LIVING[p.living], muted: p.living === 'unknown' },
    { label: 'הרכב הקבוצות', value: GENDER[p.gender], muted: p.gender === 'unknown' },
    {
      label: 'אופי דתי',
      value: p.religious_character ?? 'הארגון לא מציין',
      muted: !p.religious_character,
    },
    {
      label: 'מי יכול להצטרף',
      value: p.eligibility ?? triLabel(p.membership_required, 'רק חברי התנועה', 'פתוח גם למי שלא בתנועה'),
      muted: !p.eligibility && p.membership_required === 'unknown',
    },
    { label: 'מסלול נח"ל', value: triLabel(p.nahal_option, 'יש', 'אין'), muted: p.nahal_option === 'unknown' },
    { label: 'סוג המסגרת', value: FRAMEWORK[p.framework_type] },
    { label: 'דמי כיס ותנאים', value: p.stipend ?? 'לא פורסם', muted: !p.stipend },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/programs/${p.id}`,
        name: `${p.org.name} – ${p.name}`,
        description: p.tagline,
        inLanguage: 'he-IL',
        dateModified: p.verified_at,
        about: {
          '@type': 'Organization',
          name: p.org.name,
          ...(p.org.website ? { url: p.org.website } : {}),
          ...(p.contact.phone ? { telephone: p.contact.phone } : {}),
          ...(p.contact.email ? { email: p.contact.email } : {}),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'שנה הבאה', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'כל שנות השירות', item: `${SITE_URL}/programs` },
          { '@type': 'ListItem', position: 3, name: p.org.name, item: `${SITE_URL}/programs/${p.id}` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/programs" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        <span aria-hidden>→</span> לכל שנות השירות
      </Link>

      <section className="relative mt-4 animate-fade-up overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-brand-900/5 ring-1 ring-slate-200/70">
        <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-l ${main.tile} opacity-90`} aria-hidden />
        <div className="absolute -left-10 top-4 h-40 w-40 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <div className="relative px-6 pb-8 pt-16 sm:px-10">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-4xl shadow-lg ring-4 ring-white" aria-hidden>
            {main.emoji}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{p.org.name}</h1>
          <p className="mt-1 text-lg font-medium text-slate-500">{p.name}</p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{p.tagline}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="תחומים">
            {p.activities.map((a) => (
              <li key={a}>
                <Link href={`/programs?cat=${a}`} className={`chip ring-1 ring-inset transition-transform hover:scale-105 ${ACTIVITIES[a].chip}`}>
                  <span aria-hidden>{ACTIVITIES[a].emoji}</span> {ACTIVITIES[a].label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-l from-brand-600 to-fuchsia-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span className="absolute inset-0 -skew-x-12 animate-shine bg-gradient-to-l from-transparent via-white/30 to-transparent" aria-hidden />
                <span className="relative">{primaryLabel}</span>
                <span className="relative" aria-hidden>
                  ↗
                </span>
              </a>
            )}
            <CompareButton id={p.id} name={p.org.name} size="lg" />
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className={`chip ring-1 ring-inset ${conf.className}`} title={conf.hint}>
          {conf.label}
        </span>
        <span className="text-slate-500">
          {conf.hint}. נבדק לאחרונה ב־{formatDate(p.verified_at)}.
        </span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-10">
          <section aria-labelledby="facts-title">
            <h2 id="facts-title" className="text-2xl font-extrabold text-ink">
              בקצרה
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 transition-shadow hover:shadow-md">
                  <dt className="text-sm font-semibold text-slate-500">{f.label}</dt>
                  <dd className={`mt-1 font-bold leading-snug ${f.muted ? 'text-slate-400' : 'text-ink'}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="about-title">
            <h2 id="about-title" className="text-2xl font-extrabold text-ink">
              מה עושים בשנה הזאת
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-700">{p.description}</p>
          </section>

          {p.gaps && (
            <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200" aria-labelledby="gaps-title">
              <h2 id="gaps-title" className="font-bold text-amber-900">
                מה עוד לא הצלחנו לברר
              </h2>
              <p className="mt-1 leading-relaxed text-amber-900/80">{p.gaps}</p>
            </section>
          )}

          <section aria-labelledby="sources-title">
            <h2 id="sources-title" className="text-2xl font-extrabold text-ink">
              מקורות
            </h2>
            <p className="mt-1 text-slate-600">המידע בעמוד הזה נלקח מהמקורות האלה:</p>
            {p.sources.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {p.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 transition-all hover:ring-brand-300"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink group-hover:text-brand-700">{s.title}</span>
                        <span className="block truncate text-sm text-slate-500" dir="ltr">
                          {hostname(s.url)}
                        </span>
                      </span>
                      <span className="chip shrink-0 bg-slate-100 text-slate-600">{SOURCE_TYPE[s.type]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-slate-500">אין עדיין מקורות לתוכנית הזאת.</p>
            )}
            <a
              href={reportUrl(`${p.org.name} – ${p.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
            >
              מצאתם טעות בעמוד הזה? ספרו לנו
            </a>
          </section>
        </div>

        <aside className="order-first space-y-4 lg:order-none lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/70">
            <h2 className="font-bold text-ink">הרשמה</h2>
            <span className={`chip mt-3 ring-1 ring-inset ${reg.className}`}>{reg.label}</span>
            <dl className="mt-3 space-y-2 text-sm">
              {p.registration.open_date && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">פתיחת ההרשמה</dt>
                  <dd className="font-semibold">{formatDate(p.registration.open_date)}</dd>
                </div>
              )}
              {p.registration.deadline && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">סגירת ההרשמה</dt>
                  <dd className="font-semibold">{formatDate(p.registration.deadline)}</dd>
                </div>
              )}
            </dl>
            {p.selection && (
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                <span className="font-semibold">תהליך המיון: </span>
                {p.selection}
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/70">
            <h2 className="font-bold text-ink">יצירת קשר</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {p.contact.phone && (
                <li>
                  <span className="text-slate-500">טלפון: </span>
                  <a href={`tel:${p.contact.phone.replace(/[^\d*+]/g, '')}`} className="font-semibold text-brand-700 hover:underline" dir="ltr">
                    {p.contact.phone}
                  </a>
                </li>
              )}
              {p.contact.email && (
                <li>
                  <span className="text-slate-500">דוא&quot;ל: </span>
                  <a href={`mailto:${p.contact.email}`} className="break-all font-semibold text-brand-700 hover:underline" dir="ltr">
                    {p.contact.email}
                  </a>
                </li>
              )}
              {p.org.website && (
                <li>
                  <span className="text-slate-500">אתר: </span>
                  <a href={p.org.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline" dir="ltr">
                    {hostname(p.org.website)}
                  </a>
                </li>
              )}
              {!p.contact.phone && !p.contact.email && !p.org.website && <li className="text-slate-500">לא מצאנו פרטי קשר</li>}
            </ul>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16" aria-labelledby="similar-title">
          <h2 id="similar-title" className="text-2xl font-extrabold text-ink">
            אולי יעניין אתכם גם
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((o, i) => (
              <ProgramCard key={o.id} program={o} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
