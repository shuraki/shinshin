import programsJson from '@/data/programs.json';
import otherJson from '@/data/other-frameworks.json';
import factsJson from '@/data/facts.json';
import type { Fact, OtherFramework, Program } from './types';

export const programs = (programsJson as Program[])
  .slice()
  .sort((a, b) => a.org.name.localeCompare(b.org.name, 'he'));

export const otherFrameworks = (otherJson as OtherFramework[])
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, 'he'));

export const facts = factsJson as Fact[];

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export const lastVerified = programs.reduce((max, p) => (p.verified_at > max ? p.verified_at : max), '');
