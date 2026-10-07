'use client';

import { useSyncExternalStore } from 'react';

export const MAX_COMPARE = 4;
const KEY = 'shnat-sherut:compare';
const EMPTY: string[] = [];

let current: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (current) return current;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    current = Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string').slice(0, MAX_COMPARE) : [];
  } catch {
    current = [];
  }
  return current;
}

function write(next: string[]) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCompare() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    ids,
    has: (id: string) => ids.includes(id),
    isFull: ids.length >= MAX_COMPARE,
    toggle: (id: string) => {
      const list = read();
      if (list.includes(id)) write(list.filter((x) => x !== id));
      else if (list.length < MAX_COMPARE) write([...list, id]);
    },
    remove: (id: string) => write(read().filter((x) => x !== id)),
    clear: () => write([]),
  };
}
