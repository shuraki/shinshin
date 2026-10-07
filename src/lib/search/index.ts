import { Program, Organization, ProgramCycle, SearchResult } from '../types';
import { normalizeForSearch, tokenize, fuzzyMatch } from './normalizer';

export interface IndexEntry {
  program_id: string;
  organization_id: string;
  organization_name: string;
  program_name: string;
  short_description: string;
  searchable_text: string;
  tokens: string[];
  normalized_tokens: string[];
}

export class ProgramSearchIndex {
  private entries: Map<string, IndexEntry> = new Map();

  constructor(programs: Program[], organizations: Organization[]) {
    this.build(programs, organizations);
  }

  private build(programs: Program[], organizations: Organization[]) {
    const orgMap = new Map(organizations.map((o) => [o.id, o]));

    for (const program of programs) {
      const org = orgMap.get(program.organization_id);
      if (!org) continue;

      const searchableText = [
        program.name,
        program.short_description,
        program.full_description,
        org.name,
        program.activity_categories.join(' '),
      ]
        .filter(Boolean)
        .join(' ');

      const normalized = normalizeForSearch(searchableText);
      const tokens = tokenize(searchableText);

      const entry: IndexEntry = {
        program_id: program.id,
        organization_id: program.organization_id,
        organization_name: org.name,
        program_name: program.name,
        short_description: program.short_description,
        searchable_text: searchableText,
        tokens,
        normalized_tokens: tokens.map(normalizeForSearch),
      };

      this.entries.set(program.id, entry);
    }
  }

  search(query: string, limit: number = 20): SearchResult[] {
    if (!query.trim()) return [];

    const queryTokens = tokenize(query);
    const normalizedQuery = normalizeForSearch(query);

    const results: Array<SearchResult & { match_score: number }> = [];

    for (const entry of this.entries.values()) {
      let score = 0;
      const matchedFields: string[] = [];

      // Exact match on program name (highest priority)
      if (normalizeForSearch(entry.program_name) === normalizedQuery) {
        score += 100;
        matchedFields.push('name');
      }

      // Substring match on program name
      if (normalizeForSearch(entry.program_name).includes(normalizedQuery)) {
        score += 50;
        matchedFields.push('name');
      }

      // Exact match on organization name
      if (normalizeForSearch(entry.organization_name) === normalizedQuery) {
        score += 80;
        matchedFields.push('organization');
      }

      // Token-based matching
      for (const token of queryTokens) {
        const normalized = normalizeForSearch(token);

        // Exact token match
        if (entry.normalized_tokens.includes(normalized)) {
          score += 30;
          if (!matchedFields.includes('tokens')) matchedFields.push('tokens');
        }

        // Fuzzy match
        const fuzzyMatches = entry.normalized_tokens.filter(
          (t) => fuzzyMatch(normalized, t) > 0.7,
        );
        if (fuzzyMatches.length > 0) {
          score += fuzzyMatches.length * 10;
          if (!matchedFields.includes('fuzzy')) matchedFields.push('fuzzy');
        }
      }

      // Description matching (lower priority)
      if (normalizeForSearch(entry.short_description).includes(normalizedQuery)) {
        score += 15;
        matchedFields.push('description');
      }

      if (score > 0) {
        results.push({
          program_id: entry.program_id,
          organization_name: entry.organization_name,
          program_name: entry.program_name,
          short_description: entry.short_description,
          match_score: score,
          matched_fields: [...new Set(matchedFields)],
        });
      }
    }

    // Sort by score (descending)
    results.sort((a, b) => b.match_score - a.match_score);

    return results.slice(0, limit);
  }

  autocomplete(query: string, limit: number = 10): string[] {
    if (!query.trim()) return [];

    const normalized = normalizeForSearch(query);
    const suggestions = new Set<string>();

    for (const entry of this.entries.values()) {
      if (normalizeForSearch(entry.program_name).startsWith(normalized)) {
        suggestions.add(entry.program_name);
      }
      if (normalizeForSearch(entry.organization_name).startsWith(normalized)) {
        suggestions.add(entry.organization_name);
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }
}

export function createSearchIndex(programs: Program[], organizations: Organization[]): ProgramSearchIndex {
  return new ProgramSearchIndex(programs, organizations);
}
