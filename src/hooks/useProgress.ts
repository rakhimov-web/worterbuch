import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { progressStore, type Flag } from '../lib/progress';

/** Progress for one lesson; ids that no longer exist in the lesson are ignored. */
export function useProgress(slug: string, validIds: string[]) {
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);
  const entry = state.lessons[slug];

  const { learned, difficult } = useMemo(() => {
    const valid = new Set(validIds);
    return {
      learned: new Set((entry?.learned ?? []).filter((id) => valid.has(id))),
      difficult: new Set((entry?.difficult ?? []).filter((id) => valid.has(id))),
    };
  }, [entry, validIds]);

  const toggle = useCallback((id: string, flag: Flag) => progressStore.toggle(slug, id, flag), [slug]);
  const addDifficult = useCallback((ids: string[]) => progressStore.addFlag(slug, ids, 'difficult'), [slug]);

  return { learned, difficult, toggle, addDifficult };
}
