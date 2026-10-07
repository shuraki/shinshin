import type { Metadata } from 'next';
import Link from 'next/link';
import { facts, programs } from '@/lib/data';
import { pageMeta, reportUrl } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'מה זה שנת שירות?',
  description:
    'מה זה שנת שירות (ש"ש), מה ההבדל בינה לבין מכינה קדם-צבאית ושירות לאומי, מתי נרשמים, כמה דמי כיס מקבלים ואיך נדחה הגיוס. עם מקורות רשמיים.',
  path: '/about',
});

const COMPARE = [
  {
    title: 'שנת שירות (ש"ש)',
    emoji: '🤝',
    color: 'from-brand-500 to-fuchsia-500',
    text: 'שנה של התנדבות בקהילה לפני הגיוס, לרוב בקבוצה ובקומונה. רוב היום מוקדש לעשייה: הדרכה, חינוך, עבודה עם ילדים, טבע או קהילה.',
  },
  {
    title: 'מכינה קדם-צבאית',
    emoji: '📖',
    color: 'from-sky-500 to-cyan-500',
    text: 'גם היא דוחה את הגיוס בשנה, אבל במכינה העיקר הוא לימוד, פיתוח אישי והכנה לצבא. זו מסגרת אחרת, ולכן היא לא מופיעה באתר.',
  },
  {
    title: 'שירות לאומי',
    emoji: '🏥',
    color: 'from-amber-500 to-orange-500',
    text: 'מיועד למי שקיבלו פטור משירות צבאי, והוא בא במקום הצבא ולא לפניו. זה מסלול אחר, ולכן גם הוא לא מופיע באתר.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      <header className="animate-fade-up">
        <p className="text-sm font-bold text-brand-600">המדריך הקצר</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-5xl">מה זה שנת שירות?</h1>
        <p className="mt-4 text-xl leading-relaxed text-slate-600">
          שנת שירות היא שנה של התנדבות לפני הגיוס לצה&quot;ל. המתנדבים, שנקראים גם ש&quot;שים או שינשינים, עובדים
          בקהילה ובחינוך, ובדרך כלל גרים יחד בקומונה. נרשמים ישירות לארגון שמפעיל את השנה, עוברים אצלו מיונים, והגיוס
          נדחה בשנה.
        </p>
      </header>

      <section className="mt-12" aria-labelledby="diff-title">
        <h2 id="diff-title" className="text-2xl font-extrabold text-ink">
          מה ההבדל בין שנת שירות, מכינה ושירות לאומי?
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {COMPARE.map((c, i) => (
            <div
              key={c.title}
              className="animate-fade-up rounded-3xl bg-white p-6 ring-1 ring-slate-200/70 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl shadow-md`} aria-hidden>
                {c.emoji}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {facts.length > 0 && (
        <section className="mt-14" aria-labelledby="facts-title">
          <h2 id="facts-title" className="text-2xl font-extrabold text-ink">
            מה חשוב לדעת
          </h2>
          <ul className="mt-5 space-y-3">
            {facts.map((f) => (
              <li key={f.text} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
                <p className="text-lg leading-relaxed text-ink">{f.text}</p>
                <a href={f.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline">
                  מקור: {f.source_title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="method" className="mt-14 scroll-mt-24 rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-6 ring-1 ring-brand-100 sm:p-10" aria-labelledby="method-title">
        <h2 id="method-title" className="text-2xl font-extrabold text-ink">
          איך אנחנו בודקים את המידע
        </h2>
        <ul className="mt-5 space-y-4 text-lg leading-relaxed text-slate-700">
          <li className="flex gap-3">
            <span aria-hidden>🔗</span>
            <span>כל פרט על תוכנית נלקח מאתר הארגון עצמו או ממקור ממשלתי. בכל עמוד תוכנית יש רשימת מקורות עם קישורים.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden>❔</span>
            <span>
              אם לא מצאנו מידע, כתוב &quot;לא ידוע&quot;. אנחנו לא מנחשים, ובמיוחד לא בנושאים כמו אופי דתי, שמירת שבת או
              הפרדה בין בנים לבנות. את אלה נכתוב רק אם הארגון עצמו כותב אותם.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden>📅</span>
            <span>ליד כל תוכנית מופיע התאריך שבו בדקנו אותה. מועדי הרשמה משתנים כל שנה, אז לפני שנרשמים כדאי לבדוק באתר הארגון.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden>🧭</span>
            <span>באתר מופיעות רק שנות שירות. מכינות קדם-צבאיות, שירות לאומי וישיבות הן מסגרות אחרות, ולכן הן לא כלולות.</span>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/programs" className="rounded-full bg-brand-600 px-6 py-3 font-bold text-white shadow-md hover:bg-brand-700">
            לכל {programs.length} שנות השירות
          </Link>
          <a href={reportUrl()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-6 py-3 font-bold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">
            מצאתם טעות? ספרו לנו
          </a>
        </div>
      </section>
    </div>
  );
}
