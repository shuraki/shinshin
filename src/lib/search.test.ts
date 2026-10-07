import { describe, expect, it } from 'vitest';
import { programs } from './data';
import { buildIndex, normalize, search, tokenScore } from './search';

const index = buildIndex(programs);
const ids = (q: string) => search(index, q).map((p) => p.id);

describe('normalize', () => {
  it('strips niqqud, quotes and final letters', () => {
    expect(normalize('שָׁנַת שֵׁרוּת')).toBe('שנת שרות');
    expect(normalize('ש"ש')).toBe('שש');
    expect(normalize('נוע״ם')).toBe('נועמ');
    expect(normalize('קומונה - צפון!')).toBe('קומונה צפונ');
  });
});

describe('tokenScore', () => {
  it('matches Hebrew prefixes', () => {
    expect(tokenScore('קומונה', 'בקומונה')).toBeGreaterThan(0);
    expect(tokenScore('הצופימ', 'צופימ')).toBeGreaterThan(0);
  });
  it('tolerates a small typo', () => {
    expect(tokenScore('קרמבוו', 'קרמבו')).toBeGreaterThan(0);
  });
  it('does not match unrelated words', () => {
    expect(tokenScore('חקלאות', 'חינוכ')).toBe(0);
  });
});

describe('search', () => {
  it('finds a program by organization name', () => {
    expect(ids('קרמבו')[0]).toBe('krembo');
    expect(ids('הצופים')[0]).toBe('zofim');
  });
  it('finds by name with geresh/gershayim variants', () => {
    expect(ids('נועם')).toContain('noam');
    expect(ids('נוע"ם')).toContain('noam');
  });
  it('finds by city', () => {
    expect(ids('באר שבע').length).toBeGreaterThan(0);
  });
  it('finds by topic', () => {
    expect(ids('חקלאות')).toContain('hashomer-hachadash');
    expect(ids('טבע')).toContain('spni');
  });
  it('treats generic words as "everything"', () => {
    expect(ids('שנת שירות').length).toBe(programs.length);
    expect(ids('ש"ש').length).toBe(programs.length);
  });
  it('returns nothing for gibberish', () => {
    expect(ids('קקקקקקק')).toEqual([]);
  });
});
