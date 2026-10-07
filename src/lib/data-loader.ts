/**
 * Data loader for programs and organizations
 * Loads from JSON files in data/ directory
 * Can be replaced with API calls later without changing the interface
 */

import { Organization, Program, ProgramCycle, Source } from './types';

// In-memory cache (in production, use React Query or similar)
let organizationsCache: Organization[] | null = null;
let programsCache: Program[] | null = null;
let cyclesCache: ProgramCycle[] | null = null;
let sourcesCache: Source[] | null = null;

export async function loadOrganizations(): Promise<Organization[]> {
  if (organizationsCache) return organizationsCache;

  try {
    const response = await fetch('/data/organizations.json');
    organizationsCache = await response.json();
    return organizationsCache || [];
  } catch (error) {
    console.error('Failed to load organizations:', error);
    return [];
  }
}

export async function loadPrograms(): Promise<Program[]> {
  if (programsCache) return programsCache;

  try {
    const response = await fetch('/data/programs.json');
    programsCache = await response.json();
    return programsCache || [];
  } catch (error) {
    console.error('Failed to load programs:', error);
    return [];
  }
}

export async function loadCycles(): Promise<ProgramCycle[]> {
  if (cyclesCache) return cyclesCache;

  try {
    const response = await fetch('/data/cycles.json');
    cyclesCache = await response.json();
    return cyclesCache || [];
  } catch (error) {
    console.error('Failed to load cycles:', error);
    return [];
  }
}

export async function loadSources(): Promise<Source[]> {
  if (sourcesCache) return sourcesCache;

  try {
    const response = await fetch('/data/sources.json');
    sourcesCache = await response.json();
    return sourcesCache || [];
  } catch (error) {
    console.error('Failed to load sources:', error);
    return [];
  }
}

export async function getAllData() {
  return Promise.all([
    loadOrganizations(),
    loadPrograms(),
    loadCycles(),
    loadSources(),
  ]).then(([orgs, progs, cycs, srcs]) => ({
    organizations: orgs,
    programs: progs,
    cycles: cycs,
    sources: srcs,
  }));
}

// Clear cache (useful for revalidation)
export function clearCache() {
  organizationsCache = null;
  programsCache = null;
  cyclesCache = null;
  sourcesCache = null;
}
