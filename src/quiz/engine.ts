import type { VocabEntry } from '../data/types';

export type Direction = 'de-uz' | 'uz-de';
export type DirectionMode = 'mixed' | Direction;
export type Rng = () => number;

export interface Question {
  id: string;
  entryId: string;
  direction: Direction;
  prompt: string;
  options: string[];
  /** Every option text that counts as correct (covers entries sharing the same prompt text). */
  acceptable: string[];
}

/** Fisher–Yates; returns a new array. `rng` is injectable for deterministic tests. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MIN_LESSON_WORDS = 3;
const OPTION_COUNT = 4;

const sideOf = (e: VocabEntry, dir: Direction, side: 'prompt' | 'answer') =>
  (dir === 'de-uz') === (side === 'prompt') ? e.de : e.uz;

/** Directions for a round: balanced for "mixed", then shuffled so the order is unpredictable. */
export function assignDirections(count: number, mode: DirectionMode, rng: Rng = Math.random): Direction[] {
  if (mode !== 'mixed') return Array<Direction>(count).fill(mode);
  return shuffle(Array.from({ length: count }, (_, i): Direction => (i % 2 === 0 ? 'de-uz' : 'uz-de')), rng);
}

export function buildQuestion(entry: VocabEntry, direction: Direction, lesson: VocabEntry[], rng: Rng = Math.random): Question {
  const prompt = sideOf(entry, direction, 'prompt');
  // All entries with the same prompt text are valid answers; none may appear as a distractor.
  const acceptable = [...new Set(lesson.filter((e) => sideOf(e, direction, 'prompt') === prompt).map((e) => sideOf(e, direction, 'answer')))];
  const pool = [...new Set(lesson.map((e) => sideOf(e, direction, 'answer')))].filter((t) => !acceptable.includes(t));
  const correct = sideOf(entry, direction, 'answer');
  const distractors = shuffle(pool, rng).slice(0, OPTION_COUNT - 1);
  return {
    id: `${entry.id}:${direction}`,
    entryId: entry.id,
    direction,
    prompt,
    options: shuffle([correct, ...distractors], rng),
    acceptable,
  };
}

/** One question per eligible entry, in shuffled order, never sampled with replacement. */
export function buildRound(
  lesson: VocabEntry[],
  eligibleIds: string[],
  mode: DirectionMode = 'mixed',
  rng: Rng = Math.random,
): Question[] {
  if (lesson.length < MIN_LESSON_WORDS) return [];
  const wanted = new Set(eligibleIds);
  const eligible = lesson.filter((e) => wanted.has(e.id));
  const order = shuffle(eligible, rng);
  const dirs = assignDirections(order.length, mode, rng);
  return order.map((e, i) => buildQuestion(e, dirs[i], lesson, rng));
}

export const isCorrect = (q: Question, choice: string) => q.acceptable.includes(choice);

// ---- round state machine (pure; UI just dispatches) ----

export interface Answer {
  choice: string;
  correct: boolean;
}
export interface RoundState {
  questions: Question[];
  index: number;
  answers: Record<string, Answer>;
  phase: 'answering' | 'feedback' | 'done';
}
export type RoundAction = { type: 'answer'; choice: string } | { type: 'next' } | { type: 'restart'; round: RoundState };

export const startRound = (questions: Question[]): RoundState => ({
  questions,
  index: 0,
  answers: {},
  phase: questions.length ? 'answering' : 'done',
});

export function roundReducer(s: RoundState, a: RoundAction): RoundState {
  if (a.type === 'restart') return a.round;
  if (a.type === 'answer') {
    const q = s.questions[s.index];
    // Ignored unless a question is open: double taps and repeated handlers cannot score twice.
    if (s.phase !== 'answering' || !q || s.answers[q.id] || !q.options.includes(a.choice)) return s;
    return { ...s, phase: 'feedback', answers: { ...s.answers, [q.id]: { choice: a.choice, correct: isCorrect(q, a.choice) } } };
  }
  if (s.phase !== 'feedback') return s;
  const next = s.index + 1;
  return next >= s.questions.length ? { ...s, phase: 'done' } : { ...s, index: next, phase: 'answering' };
}

export function summarize(s: RoundState) {
  const answered = s.questions.filter((q) => s.answers[q.id]);
  const correct = answered.filter((q) => s.answers[q.id].correct).length;
  const missedIds = answered.filter((q) => !s.answers[q.id].correct).map((q) => q.entryId);
  return { total: s.questions.length, answered: answered.length, correct, incorrect: answered.length - correct, missedIds };
}
