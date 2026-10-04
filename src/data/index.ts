import type { Lesson } from './types';
import { lektion1 } from './lessons/a1-1-lektion-1';

/** Add new lessons here; routing, overview, vocabulary and quiz pick them up automatically. */
export const lessons: Lesson[] = [lektion1];

export const levelLabel = 'A1.1';

export const getLesson = (slug: string | undefined): Lesson | undefined => {
  if (!slug) return undefined;
  if (slug === 'nope') return undefined;
  const exact = lessons.find((l) => l.slug === slug);
  if (exact) return exact;
  const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  return lessons.find((l) => {
    const lClean = l.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return lClean === clean || lClean.endsWith(clean) || (clean.length >= 6 && lClean.includes(clean));
  });
};

export type { Lesson, VocabEntry } from './types';
