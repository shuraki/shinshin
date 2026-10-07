export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900">מה עושים בשנה הבאה?</h1>
          <p className="text-lg text-slate-600 mt-2">כל שנות השירות במקום אחד</p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <p className="text-xl text-slate-700 mb-8">
            עשרות אפשרויות לשנת שירות. מה קיים, מה באמת עושים בכל אחת, ואיזו מתאימה לי?
          </p>

          {/* Search placeholder */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
            <p className="text-slate-600 text-center">חיפוש בבנייה...</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">עיון לפי קטגוריה</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[
              'דתיים',
              'חינוך',
              'חקלאות',
              'נוער בסיכון',
              'צרכים מיוחדים',
              'טבע וטיולים',
              'אמנות ותרבות',
              'קהילה',
            ].map((cat) => (
              <div
                key={cat}
                className="p-4 bg-slate-100 rounded-lg text-center text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {cat}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">לא יודעים איפה להתחיל?</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <p className="text-slate-700 mb-4">תענו על כמה שאלות וניגיד לכם אילו מסגרות כדאי לבדוק</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              התחילו את הגיד
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
