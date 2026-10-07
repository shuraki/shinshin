import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-24 text-center">
      <p className="text-6xl" aria-hidden>
        🧭
      </p>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">העמוד לא נמצא</h1>
      <p className="mt-2 text-lg text-slate-600">אולי הקישור השתנה. אפשר לחפש את התוכנית ברשימה המלאה.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/programs" className="rounded-full bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
          לכל שנות השירות
        </Link>
        <Link href="/" className="rounded-full bg-white px-6 py-3 font-bold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">
          לעמוד הבית
        </Link>
      </div>
    </div>
  );
}
