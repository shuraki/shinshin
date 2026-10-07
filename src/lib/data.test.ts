import { describe, expect, it } from 'vitest';
import { facts, otherFrameworks, programs } from './data';
import { ACTIVITIES, REGIONS } from './labels';

const isUrl = (u: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(u).protocol);
  } catch {
    return false;
  }
};

describe('program data', () => {
  it('has unique ids', () => {
    expect(new Set(programs.map((p) => p.id)).size).toBe(programs.length);
  });

  it.each(programs.map((p) => [p.id, p] as const))('%s is well formed', (_, p) => {
    expect(p.sources.length).toBeGreaterThan(0);
    expect(p.sources.some((s) => s.type === 'official')).toBe(true);
    for (const s of p.sources) expect(isUrl(s.url)).toBe(true);
    for (const u of [p.org.website, p.program_url, p.registration_url]) if (u) expect(isUrl(u)).toBe(true);
    expect(p.activities.length).toBeGreaterThan(0);
    for (const a of p.activities) expect(ACTIVITIES[a]).toBeDefined();
    for (const r of p.regions) expect(REGIONS[r]).toBeDefined();
    expect(p.verified_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.tagline.length).toBeLessThan(160);
    for (const d of [p.registration.open_date, p.registration.deadline]) if (d) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('never links to known-compromised or wrong domains', () => {
    const banned = ['hamahanot-haolim.org.il', 'komona.bneiakiva.org.il', 'lasova.org.il/registration', 'r.sayarut.org.il'];
    const all = JSON.stringify(programs) + JSON.stringify(otherFrameworks);
    for (const b of banned) expect(all).not.toContain(b);
    const bakehila = programs.find((p) => p.id === 'bakehila');
    expect(bakehila?.org.website).not.toBe('https://bakehila.org.il/');
  });

  it('has no Latin-only enum values leaking into Hebrew text fields', () => {
    for (const p of programs) {
      for (const text of [p.name, p.tagline, p.description, p.org.name]) {
        expect(text).not.toMatch(/_[a-z]/);
      }
    }
  });
});

describe('facts', () => {
  it('each fact has a source', () => {
    for (const f of facts) expect(isUrl(f.source_url)).toBe(true);
  });
});
