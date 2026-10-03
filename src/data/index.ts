import type { Lesson } from './types';
import { lektion1 } from './lessons/a1-1-lektion-1';

/** Add new lessons here; routing, overview, vocabulary and quiz pick them up automatically. */
export const lessons: Lesson[] = [lektion1];

export const levelLabel = 'A1.1';

export const getLesson = (slug: string | undefined): Lesson | undefined =>
  lessons.find((l) => l.slug === slug);

export type { Lesson, VocabEntry } from './types';
