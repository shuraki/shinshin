import { ACTIVITIES, FRAMEWORK, LIVING, REGIONS } from './labels';
import type { Program } from './types';

const NIQQUD = /[֑-ׇ]/g;
const FINALS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
const PREFIXES = ['וה', 'שה', 'בה', 'לה', 'מה', 'כש', 'ה', 'ו', 'ב', 'ל', 'מ', 'ש', 'כ'];

// Words that appear on every program (or carry no meaning) and would otherwise match everything.
const STOPWORDS = new Set(['שנת', 'שנה', 'שירות', 'שש', 'שינשינ', 'של', 'את', 'עמ', 'על', 'או', 'גמ']);

const SYNONYMS: Record<string, string[]> = {
  קומונות: ['קומונה'],
  קומונרימ: ['קומונה'],
  קומונריות: ['קומונה'],
  מוגבלויות: ['מוגבלות'],
  דתי: ['דתית', 'יהדות'],
  דתיימ: ['דתי', 'דתית', 'יהדות'],
  חילוני: ['חילונית', 'פלורליסטי'],
  טבע: ['סביבה'],
};

export function normalize(text: string): string {
  return text
    .replace(NIQQUD, '')
    .replace(/[ךםןףץ]/g, (c) => FINALS[c])
    .toLowerCase()
    .replace(/["'׳״`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const n = normalize(text);
  return n ? n.split(' ') : [];
}

function stripPrefix(token: string): string[] {
  const out: string[] = [];
  for (const p of PREFIXES) {
    if (token.startsWith(p) && token.length - p.length >= 2) out.push(token.slice(p.length));
  }
  return out;
}

function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

// 1 = exact, 0.8 = prefix / Hebrew prefix letter, 0.5 = typo, 0 = no match
export function tokenScore(query: string, doc: string): number {
  if (query === doc) return 1;
  const qs = [query, ...stripPrefix(query)];
  const ds = [doc, ...stripPrefix(doc)];
  for (const q of qs) {
    for (const d of ds) {
      if (q === d) return 0.9;
      if (q.length >= 2 && d.startsWith(q)) return 0.8;
    }
  }
  if (query.length >= 4) {
    const max = query.length >= 7 ? 2 : 1;
    for (const q of qs) {
      if (q.length < 4) continue;
      for (const d of ds) {
        if (editDistance(q, d, max) <= max) return 0.5;
        if (d.length > q.length + 1 && editDistance(q, d.slice(0, q.length), 1) <= 1) return 0.4;
      }
    }
  }
  return 0;
}

interface Field {
  tokens: string[];
  weight: number;
}

export interface IndexedProgram {
  program: Program;
  fields: Field[];
}

export function buildIndex(programs: Program[]): IndexedProgram[] {
  return programs.map((p) => ({
    program: p,
    fields: [
      { tokens: tokenize(p.name), weight: 6 },
      { tokens: tokenize(p.org.name), weight: 6 },
      {
        tokens: tokenize(
          p.activities.map((a) => `${ACTIVITIES[a].label} ${ACTIVITIES[a].keywords}`).join(' '),
        ),
        weight: 3,
      },
      {
        tokens: tokenize(
          [...p.locations, ...p.regions.map((r) => REGIONS[r]), LIVING[p.living], FRAMEWORK[p.framework_type]].join(' '),
        ),
        weight: 2.5,
      },
      { tokens: tokenize(`${p.tagline} ${p.religious_character ?? ''} ${p.nahal_option === true ? 'נחל' : ''}`), weight: 2 },
      { tokens: tokenize(p.description), weight: 1 },
    ],
  }));
}

export function queryTerms(query: string): string[][] {
  return tokenize(query)
    .filter((t) => !STOPWORDS.has(t) && t.length >= 2)
    .map((t) => [t, ...(SYNONYMS[t] ?? [])]);
}

export function scoreProgram(entry: IndexedProgram, terms: string[][]): number {
  let total = 0;
  for (const variants of terms) {
    let best = 0;
    for (const field of entry.fields) {
      for (const doc of field.tokens) {
        for (const v of variants) {
          const s = tokenScore(v, doc);
          if (s > 0) best = Math.max(best, s * field.weight);
        }
      }
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

export function search(index: IndexedProgram[], query: string): Program[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return index.map((e) => e.program);
  return index
    .map((e) => ({ p: e.program, s: scoreProgram(e, terms) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.p);
}
