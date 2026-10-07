'use client';

import { useEffect, useState } from 'react';
import { Program, ProgramCycle, Organization } from '@/lib/types';
import { loadPrograms, loadOrganizations, loadCycles } from '@/lib/data-loader';
import { translate } from '@/lib/translations';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramPage({ params: paramsPromise }: PageProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [cycle, setCycle] = useState<ProgramCycle | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    paramsPromise.then(async (params) => {
      setId(params.id);
      const [programs, orgs, cycles] = await Promise.all([
        loadPrograms(),
        loadOrganizations(),
        loadCycles(),
      ]);

      const foundProgram = programs.find((p) => p.id === params.id);
      if (foundProgram) {
        setProgram(foundProgram);
        const org = orgs.find((o) => o.id === foundProgram.organization_id);
        setOrganization(org || null);

        const cycle = cycles.find((c) => c.program_id === params.id);
        setCycle(cycle || null);
      }
      setIsLoading(false);
    });
  }, [paramsPromise]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">טוען...</p>
      </div>
    );
  }

  if (!program || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">התוכנית לא נמצאה</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
            ← חזרה לעמוד הבית
          </a>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{program.name}</h1>
          <p className="text-lg text-slate-600">{organization.name}</p>
        </div>

        {/* Overview */}
        <section className="mb-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">מה זה?</h2>
          <p className="text-lg text-slate-700 leading-relaxed">{program.full_description}</p>
        </section>

        {/* Key Details */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">מסוג מסגרת</h3>
            <p className="text-slate-700">{translate('frameType', program.framework_type)}</p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">סדר חיים</h3>
            <p className="text-slate-700">
              {translate('livingArrangement', program.living_arrangement)}
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">מבנה קבוצה</h3>
            <p className="text-slate-700">
              {translate('genderStructure', program.gender_structure)}
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">חברות קודמת</h3>
            <p className="text-slate-700">
              {program.requires_movement_membership ? 'נדרשת' : 'לא נדרשת'}
            </p>
          </div>
        </section>

        {/* Registration */}
        {cycle && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">הרשמה וקבלה</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cycle.application_open_date && (
                <div className="p-6 bg-slate-50 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">פתיחת הרשמה</h3>
                  <p className="text-slate-700">{cycle.application_open_date}</p>
                </div>
              )}

              {cycle.application_deadline && (
                <div className="p-6 bg-slate-50 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">סיום הרשמה</h3>
                  <p className="text-slate-700">{cycle.application_deadline}</p>
                </div>
              )}

              {cycle.selection_process && (
                <div className="p-6 bg-slate-50 rounded-lg col-span-full">
                  <h3 className="font-bold text-slate-900 mb-2">תהליך הבחירה</h3>
                  <p className="text-slate-700">{cycle.selection_process}</p>
                </div>
              )}

              {cycle.registration_url && (
                <div className="col-span-full">
                  <a
                    href={cycle.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    → לעמוד ההרשמה הרשמי
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Activities */}
        {program.activity_categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">תחומי פעילות</h2>
            <div className="flex flex-wrap gap-2">
              {program.activity_categories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 text-sm font-medium"
                >
                  {translate('activityCategory', cat)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {organization.contact && (
          <section className="mb-12 p-6 border border-slate-200 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">יצירת קשר</h2>
            <div className="space-y-3">
              {organization.contact.phone && (
                <p>
                  <span className="font-bold text-slate-900">טלפון:</span>{' '}
                  <a
                    href={`tel:${organization.contact.phone}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {organization.contact.phone}
                  </a>
                </p>
              )}
              {organization.contact.email && (
                <p>
                  <span className="font-bold text-slate-900">דוא"ל:</span>{' '}
                  <a
                    href={`mailto:${organization.contact.email}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {organization.contact.email}
                  </a>
                </p>
              )}
              {organization.contact.address && (
                <p>
                  <span className="font-bold text-slate-900">כתובת:</span> {organization.contact.address}
                </p>
              )}
              {organization.official_website && (
                <p>
                  <span className="font-bold text-slate-900">אתר:</span>{' '}
                  <a
                    href={organization.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {organization.official_website}
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* Verification Info */}
        {cycle && (
          <section className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600">
            <p>✓ נבדק בתאריך: {new Date(cycle.last_verified_at).toLocaleDateString('he-IL')}</p>
            <p>רמת ביטחון: {translate('confidenceLevel', cycle.confidence_level)}</p>
          </section>
        )}
      </div>
    </div>
  );
}
