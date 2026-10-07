/**
 * Hebrew text normalizer for search
 * Handles niqqud, special characters, synonyms, and common variations
 */

const HEBREW_NIQQUD = /[֑-ׇ]/g; // Remove Hebrew diacritical marks
const HEBREW_FINAL_LETTERS: Record<string, string> = {
  ך: 'כ',
  ם: 'מ',
  ן: 'נ',
  ף: 'פ',
  ץ: 'צ',
};

const HEBREW_SYNONYMS: Record<string, string[]> = {
  'שנת שירות': ['ש"ש', 'שש', 'שינשין', 'service year'],
  'קומונה': ['קומונר', 'קומונרים', 'קומוניות', 'commune'],
  'גרעין': ['גרעינים', 'core'],
  'תנועה': ['תנועות', 'movement', 'movements'],
  'כיתה': ['כיתות', 'grade', 'grades'],
  'מסגרת': ['מסגרות', 'framework', 'frameworks'],
  'ארגון': ['ארגונים', 'organization', 'organizations'],
};

function normalizeHebrewChar(char: string): string {
  // Convert final letters to standard form
  return HEBREW_FINAL_LETTERS[char] || char;
}

function removeNiqqud(text: string): string {
  return text.replace(HEBREW_NIQQUD, '');
}

function removeSpecialChars(text: string): string {
  // Remove geresh (׳), gershayim (״), quotes, hyphens, parentheses
  return text
    .replace(/[׳״\-\(\)\[\]\{\}«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandSynonyms(text: string): string[] {
  const results = [text];
  for (const [standard, variants] of Object.entries(HEBREW_SYNONYMS)) {
    if (text.includes(standard)) {
      variants.forEach((variant) => {
        results.push(text.replace(standard, variant));
      });
    }
    variants.forEach((variant) => {
      if (text.includes(variant)) {
        results.push(text.replace(variant, standard));
      }
    });
  }
  return [...new Set(results)];
}

function removeCommonPrefixes(text: string): string {
  // Hebrew prefixes: ה (the), ב (in), ל (to), מ (from), ו (and)
  // Also handles combinations like "בה" (in the)
  const prefixes = ['בה', 'לה', 'מה', 'והה', 'וה', 'ב', 'ל', 'מ', 'ו', 'ה'];
  let result = text;
  for (const prefix of prefixes) {
    if (result.startsWith(prefix) && result.length > prefix.length) {
      result = result.slice(prefix.length);
    }
  }
  return result;
}

export function normalizeForSearch(text: string): string {
  // Step 1: Remove diacritical marks
  let normalized = removeNiqqud(text);

  // Step 2: Convert final letters to standard form
  normalized = Array.from(normalized)
    .map(normalizeHebrewChar)
    .join('');

  // Step 3: Remove special characters
  normalized = removeSpecialChars(normalized);

  // Step 4: Convert to lowercase (for Latin characters)
  normalized = normalized.toLowerCase();

  // Step 5: Remove common prefixes
  normalized = removeCommonPrefixes(normalized);

  return normalized.trim();
}

export function getSearchVariants(text: string): string[] {
  const normalized = normalizeForSearch(text);
  const variants = [normalized];

  // Add version without prefix removal
  const withoutPrefixRemoval = removeNiqqud(text)
    .split('')
    .map(normalizeHebrewChar)
    .join('');
  const cleaned = removeSpecialChars(withoutPrefixRemoval).toLowerCase();
  if (cleaned !== normalized) {
    variants.push(cleaned);
  }

  // Add synonyms
  const synonymExpanded = expandSynonyms(normalized);
  variants.push(...synonymExpanded);

  return [...new Set(variants)];
}

export function tokenize(text: string): string[] {
  const cleaned = removeNiqqud(text)
    .split('')
    .map(normalizeHebrewChar)
    .join('');
  return removeSpecialChars(cleaned)
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/**
 * Simple Levenshtein distance for handling typos
 * Returns a score 0-1 where 1 is identical
 */
export function fuzzyMatch(query: string, target: string, maxDistance: number = 2): number {
  const q = normalizeForSearch(query);
  const t = normalizeForSearch(target);

  if (q === t) return 1;
  if (q.length === 0 || t.length === 0) return 0;

  const distance = levenshteinDistance(q, t);
  if (distance > maxDistance) return 0;

  // Score: closer to 1 = better match
  return Math.max(0, 1 - distance / Math.max(q.length, t.length));
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}
