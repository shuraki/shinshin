'use client';

import { useCompare } from './compare-store';

export function CompareButton({ id, name, size = 'sm' }: { id: string; name: string; size?: 'sm' | 'lg' }) {
  const { has, toggle, isFull } = useCompare();
  const selected = has(id);
  const disabled = !selected && isFull;

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={selected ? `הסרת ${name} מההשוואה` : `הוספת ${name} להשוואה`}
      title={disabled ? 'אפשר להשוות עד 4 תוכניות' : undefined}
      className={`relative z-10 inline-flex items-center gap-1.5 rounded-full font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
        size === 'lg' ? 'px-5 py-3 text-base' : 'px-3 py-1.5 text-sm'
      } ${
        selected
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
          : 'bg-white text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50'
      }`}
    >
      <span aria-hidden className={selected ? 'animate-pop' : ''}>
        {selected ? '✓' : '+'}
      </span>
      {selected ? 'בהשוואה' : 'להשוואה'}
    </button>
  );
}
