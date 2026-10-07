'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Program, Organization, SearchResult } from '@/lib/types';
import { loadPrograms, loadOrganizations } from '@/lib/data-loader';

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadPrograms(), loadOrganizations()])
      .then(([progs, orgs]) => {
        setPrograms(progs);
        setOrganizations(orgs);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">מה עושים בשנה הבאה?</h1>
          <p className="text-lg text-slate-600 mt-2">כל שנות השירות במקום אחד</p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <p className="text-lg text-slate-700 mb-8 text-center">
            עשרות אפשרויות לשנת שירות. מה קיים, מה באמת עושים בכל אחת, ואיזו מתאימה לי?
          </p>

          {!isLoading && (
            <SearchBar
              programs={programs}
              organizations={organizations}
              onResults={setSearchResults}
            />
          )}
        </section>

        {/* Results */}
        {searchResults.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              נמצאו {searchResults.length} תוכניות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.slice(0, 12).map((result) => (
                <a
                  key={result.program_id}
                  href={`/programs/${result.program_id}`}
                  className="p-6 border border-slate-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all group"
                >
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {result.program_name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{result.organization_name}</p>
                  <p className="text-slate-700 mt-3 text-sm">{result.short_description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">
                      ← לפרטים נוספים
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {searchResults.length === 0 && (
          <>
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
                    className="p-4 bg-slate-100 rounded-lg text-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
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
                  התחילו עכשיו
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
