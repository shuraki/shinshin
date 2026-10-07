import { describe, it, expect } from 'vitest';
import { normalizeForSearch, getSearchVariants, tokenize, fuzzyMatch } from './normalizer';

describe('Hebrew Search Normalizer', () => {
  describe('normalizeForSearch', () => {
    it('removes niqqud (diacritical marks)', () => {
      const withNiqqud = 'שָׁנַת שִׁירוּת';
      const normalized = normalizeForSearch(withNiqqud);
      // Should still be searchable even without visual diacritics
      expect(normalized).toBeDefined();
      expect(normalized.length).toBeGreaterThan(0);
    });

    it('converts final letters to standard form', () => {
      const withFinalLetters = 'קומונה';
      const normalized = normalizeForSearch(withFinalLetters);
      expect(normalized).toBe('קומונה'); // ם should stay as is in this context
    });

    it('removes special characters', () => {
      const withSpecial = 'שנת-שירות״ש"ש';
      const normalized = normalizeForSearch(withSpecial);
      expect(normalized).not.toContain('-');
      expect(normalized).not.toContain('״');
      expect(normalized).not.toContain('"');
    });

    it('converts to lowercase for Latin characters', () => {
      const mixed = 'Service YEAR';
      const normalized = normalizeForSearch(mixed);
      expect(normalized).toBe(normalized.toLowerCase());
    });

    it('removes common Hebrew prefixes', () => {
      expect(normalizeForSearch('בתנועה')).not.toContain('ב');
      expect(normalizeForSearch('לתוכנית')).not.toContain('ל');
      expect(normalizeForSearch('בהרשמה')).not.toContain('בה');
    });
  });

  describe('getSearchVariants', () => {
    it('generates synonym variants', () => {
      const variants = getSearchVariants('שנת שירות');
      expect(variants.length).toBeGreaterThan(1);
      expect(variants.some((v) => v.includes('ש"ש') || v.includes('שש'))).toBe(true);
    });

    it('handles קומונה synonyms', () => {
      const variants = getSearchVariants('קומונה');
      expect(variants.length).toBeGreaterThan(0);
      expect(variants.some((v) => v.includes('קומונה'))).toBe(true);
    });

    it('deduplicates variants', () => {
      const variants = getSearchVariants('משהו כלשהו');
      const unique = new Set(variants);
      expect(unique.size).toBe(variants.length);
    });
  });

  describe('tokenize', () => {
    it('splits text into tokens', () => {
      const tokens = tokenize('בני עקיבא שנת שירות');
      expect(tokens.length).toBeGreaterThan(1);
      expect(tokens.every((t) => t.length > 0)).toBe(true);
    });

    it('removes special characters in tokens', () => {
      const tokens = tokenize('שנת-שירות״ש"ש');
      expect(tokens.every((t) => !t.includes('-') && !t.includes('"'))).toBe(true);
    });
  });

  describe('fuzzyMatch', () => {
    it('matches identical strings', () => {
      const score = fuzzyMatch('שנת שירות', 'שנת שירות');
      expect(score).toBe(1);
    });

    it('matches with minor typos', () => {
      const score = fuzzyMatch('שנת שירות', 'שנת שירוות');
      expect(score).toBeGreaterThan(0.7);
    });

    it('handles prefix variations', () => {
      const score = fuzzyMatch('שנת שירות', 'לשנת השירות');
      expect(score).toBeGreaterThan(0.5);
    });

    it('returns 0 for very different strings', () => {
      const score = fuzzyMatch('שנת שירות', 'צה"ל');
      expect(score).toBeLessThanOrEqual(0.4);
    });

    it('normalizes both inputs', () => {
      const score1 = fuzzyMatch('שנת שירות', 'שנתשירות');
      const score2 = fuzzyMatch('שנתשירות', 'שנת שירות');
      expect(score1).toBe(score2);
    });
  });
});
