'use client';

import { useState } from 'react';
import { ActivityCategory, Region, FrameworkType } from '@/lib/types';
import { translate } from '@/lib/translations';

interface FiltersProps {
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  activityCategories: ActivityCategory[];
  regions: Region[];
  frameworkTypes: FrameworkType[];
  isOpen: boolean;
}

export function Filters({ onFilter }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    activityCategories: [],
    regions: [],
    frameworkTypes: [],
    isOpen: false,
  });

  const handleToggle = (type: 'activityCategories' | 'regions' | 'frameworkTypes', value: any) => {
    const newFilters = { ...filters };
    const array = newFilters[type];
    const index = (array as any[]).indexOf(value);

    if (index > -1) {
      (array as any[]).splice(index, 1);
    } else {
      (array as any[]).push(value);
    }

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      activityCategories: [],
      regions: [],
      frameworkTypes: [],
      isOpen: false,
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  const hasFilters = filters.activityCategories.length + filters.regions.length + filters.frameworkTypes.length > 0;

  return (
    <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">סינון</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
            ⟲ נקה סינון
          </button>
        )}
      </div>

      {/* Activity Categories */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 mb-3">תחומי פעילות</h4>
        <div className="flex flex-wrap gap-2">
          {['education', 'youth_mentoring', 'agriculture', 'nature_environment', 'community'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleToggle('activityCategories', cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.activityCategories.includes(cat as ActivityCategory)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {translate('activityCategory', cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 mb-3">אזור</h4>
        <div className="flex flex-wrap gap-2">
          {['north', 'center', 'south', 'national'].map((region) => (
            <button
              key={region}
              onClick={() => handleToggle('regions', region)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.regions.includes(region as Region)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {translate('region', region)}
            </button>
          ))}
        </div>
      </div>

      {/* Framework Types */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">סוג מסגרת</h4>
        <div className="flex flex-wrap gap-2">
          {['youth_movement', 'social_organization', 'settlement_movement'].map((type) => (
            <button
              key={type}
              onClick={() => handleToggle('frameworkTypes', type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.frameworkTypes.includes(type as FrameworkType)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {translate('frameType', type)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
