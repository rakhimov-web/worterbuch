export interface LessonProgress {
  learned: string[];
  difficult: string[];
}
export interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
}
export type Flag = 'learned' | 'difficult';

export const STORAGE_KEY = 'vocabulary-deutsch:progress';
const empty = (): ProgressState => ({ version: 1, lessons: {} });

const strings = (v: unknown): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : [];

/** Safely turn whatever is stored into a valid state. Never throws. */
export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return empty();
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return empty();
    const d = data as { version?: unknown; lessons?: unknown };
    if (d.version !== 1 || !d.lessons || typeof d.lessons !== 'object' || Array.isArray(d.lessons)) return empty();
    const lessons: Record<string, LessonProgress> = {};
    for (const [slug, value] of Object.entries(d.lessons as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue;
      const v = value as { learned?: unknown; difficult?: unknown };
      lessons[slug] = { learned: strings(v.learned), difficult: strings(v.difficult) };
    }
    return { version: 1, lessons };
  } catch {
    return empty();
  }
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function resolveStorage(): StorageLike | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // blocked (private mode / disabled cookies)
  }
}

export function createProgressStore(getStorage: () => StorageLike | null = resolveStorage) {
  const read = () => {
    try {
      return parseProgress(getStorage()?.getItem(STORAGE_KEY) ?? null);
    } catch {
      return empty();
    }
  };
  let state = read();
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const persist = () => {
    try {
      getStorage()?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable: keep working in memory */
    }
  };

  const update = (slug: string, fn: (p: LessonProgress) => LessonProgress) => {
    const current = state.lessons[slug] ?? { learned: [], difficult: [] };
    state = { ...state, lessons: { ...state.lessons, [slug]: fn(current) } };
    persist();
    emit();
  };

  return {
    getSnapshot: () => state,
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    /** Re-read from storage (used when another tab changes it). */
    reload() {
      state = read();
      emit();
    },
    toggle(slug: string, id: string, flag: Flag) {
      update(slug, (p) => {
        const list = p[flag];
        return { ...p, [flag]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
      });
    },
    addFlag(slug: string, ids: string[], flag: Flag) {
      update(slug, (p) => ({ ...p, [flag]: [...new Set([...p[flag], ...ids])] }));
    },
  };
}

export const progressStore = createProgressStore();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === null) progressStore.reload();
  });
}
