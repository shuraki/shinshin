'use client';

import { Program, ProgramCycle, Organization } from '@/lib/types';
import { translate } from '@/lib/translations';

interface ComparisonProps {
  programs: Array<{
    program: Program;
    cycle?: ProgramCycle;
    organization: Organization;
  }>;
  onClose: () => void;
}

export function Comparison({ programs, onClose }: ComparisonProps) {
  if (programs.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">השוואת תוכניות</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-right font-semibold text-slate-900 border-b border-slate-200">
                  מידע
                </th>
                {programs.map((p, idx) => (
                  <th
                    key={idx}
                    className="p-4 text-right font-semibold text-slate-900 border-r border-slate-200"
                  >
                    <div className="font-bold text-blue-600">{p.program.name}</div>
                    <div className="text-sm text-slate-600">{p.organization.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-4 font-semibold text-slate-900">סוג מסגרת</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    {translate('frameType', p.program.framework_type)}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">תחומי פעילות</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    <div className="flex flex-wrap gap-2">
                      {p.program.activity_categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="badge badge-primary">
                          {translate('activityCategory', cat)}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="border-b border-slate-200">
                <td className="p-4 font-semibold text-slate-900">מגורים</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    {translate('livingArrangement', p.program.living_arrangement)}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">מבנה קבוצה</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    {translate('genderStructure', p.program.gender_structure)}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-slate-200">
                <td className="p-4 font-semibold text-slate-900">סטטוס הרשמה</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    {p.cycle ? (
                      <span className="badge badge-success">
                        {translate('cycleStatus', p.cycle.cycle_status)}
                      </span>
                    ) : (
                      'לא ידוע'
                    )}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-slate-200 bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">טלפון</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    {p.organization.contact?.phone ? (
                      <a
                        href={`tel:${p.organization.contact.phone}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {p.organization.contact.phone}
                      </a>
                    ) : (
                      'לא זמין'
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900">דוא"ל</td>
                {programs.map((p, idx) => (
                  <td key={idx} className="p-4 text-slate-700 border-r border-slate-200">
                    {p.organization.contact?.email ? (
                      <a
                        href={`mailto:${p.organization.contact.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {p.organization.contact.email}
                      </a>
                    ) : (
                      'לא זמין'
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
