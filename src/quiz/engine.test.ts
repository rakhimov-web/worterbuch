import { lektion1 } from '../data/lessons/a1-1-lektion-1';
import type { VocabEntry } from '../data/types';
import { assignDirections, buildRound, roundReducer, shuffle, startRound, summarize, MIN_LESSON_WORDS } from './engine';

const entries = lektion1.entries;
const ids = entries.map((e) => e.id);
const seeded = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

describe('shuffle', () => {
  it('is a permutation and does not mutate the input', () => {
    const input = [...ids];
    const out = shuffle(input, seeded(1));
    expect([...out].sort()).toEqual([...ids].sort());
    expect(input).toEqual(ids);
  });
  it('is roughly unbiased (each item lands in each slot about equally often)', () => {
    const counts = [0, 0, 0, 0];
    const rng = seeded(7);
    for (let i = 0; i < 20000; i++) counts[shuffle([0, 1, 2, 3], rng).indexOf(0)]++;
    counts.forEach((c) => expect(Math.abs(c - 5000)).toBeLessThan(400));
  });
});

describe('buildRound', () => {
  it.each([1, 2, 3, 99])('covers every word exactly once (seed %i)', (seed) => {
    const round = buildRound(entries, ids, 'mixed', seeded(seed));
    expect(round).toHaveLength(48);
    expect(round.map((q) => q.entryId).sort()).toEqual([...ids].sort());
    expect(new Set(round.map((q) => q.id)).size).toBe(48);
  });
  it('limits the scope to the requested ids, each once', () => {
    const scope = ids.slice(5, 12);
    const round = buildRound(entries, scope, 'de-uz');
    expect(round.map((q) => q.entryId).sort()).toEqual([...scope].sort());
    expect(round.every((q) => q.direction === 'de-uz')).toBe(true);
  });
  it('balances directions in mixed mode', () => {
    const d = assignDirections(48, 'mixed', seeded(3));
    expect(d.filter((x) => x === 'de-uz')).toHaveLength(24);
  });
  it('gives 4 unique options containing the correct answer, no duplicates', () => {
    for (const q of buildRound(entries, ids, 'mixed', seeded(5))) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options.some((o) => q.acceptable.includes(o))).toBe(true);
      expect(q.options.filter((o) => q.acceptable.includes(o))).toHaveLength(1);
    }
  });
  it('returns nothing for a lesson that is too small', () => {
    expect(buildRound(entries.slice(0, MIN_LESSON_WORDS - 1), ids)).toEqual([]);
  });
  it('reduces options instead of inventing words in a tiny lesson', () => {
    const q = buildRound(entries.slice(0, 3), entries.slice(0, 3).map((e) => e.id), 'de-uz')[0];
    expect(q.options).toHaveLength(3);
  });
  it('never offers a second valid answer when two entries share a translation', () => {
    const dup: VocabEntry[] = [
      { id: 'a', de: 'der Hund', uz: 'it', pron: '-', kind: 'noun' },
      { id: 'b', de: 'der Köter', uz: 'it', pron: '-', kind: 'noun' },
      { id: 'c', de: 'die Katze', uz: 'mushuk', pron: '-', kind: 'noun' },
      { id: 'd', de: 'das Pferd', uz: 'ot', pron: '-', kind: 'noun' },
      { id: 'e', de: 'die Kuh', uz: 'sigir', pron: '-', kind: 'noun' },
    ];
    for (const q of buildRound(dup, ['a', 'b', 'c', 'd', 'e'], 'uz-de', seeded(2))) {
      // exactly one valid answer is shown; the synonym is never a distractor
      expect(q.options.filter((o) => q.acceptable.includes(o))).toHaveLength(1);
      if (q.prompt === 'it') expect(q.acceptable.sort()).toEqual(['der Hund', 'der Köter']);
    }
    const dePrompt = buildRound(dup, ['a'], 'de-uz')[0];
    expect(dePrompt.options.filter((o) => o === 'it')).toHaveLength(1);
  });
});

describe('round reducer', () => {
  const run = () => startRound(buildRound(entries, ids.slice(0, 5), 'de-uz', seeded(4)));

  it('scores each question once even with repeated answer events', () => {
    let s = run();
    const q = s.questions[0];
    s = roundReducer(s, { type: 'answer', choice: q.acceptable[0] });
    s = roundReducer(s, { type: 'answer', choice: q.acceptable[0] });
    s = roundReducer(s, { type: 'answer', choice: q.options.find((o) => !q.acceptable.includes(o))! });
    expect(summarize(s).answered).toBe(1);
    expect(summarize(s).correct).toBe(1);
  });
  it('cannot skip a question without answering', () => {
    const s = roundReducer(run(), { type: 'next' });
    expect(s.index).toBe(0);
    expect(s.phase).toBe('answering');
  });
  it('finishes only after all questions are answered and reports the real score', () => {
    let s = run();
    let i = 0;
    while (s.phase !== 'done') {
      const q = s.questions[s.index];
      expect(s.phase).toBe('answering');
      const wrong = q.options.find((o) => !q.acceptable.includes(o))!;
      s = roundReducer(s, { type: 'answer', choice: i++ % 2 === 0 ? q.acceptable[0] : wrong });
      s = roundReducer(s, { type: 'next' });
    }
    const r = summarize(s);
    expect(r).toMatchObject({ total: 5, answered: 5, correct: 3, incorrect: 2 });
    expect(r.missedIds).toHaveLength(2);
  });
  it('rejects choices that are not options', () => {
    const s = roundReducer(run(), { type: 'answer', choice: 'not an option' });
    expect(s.phase).toBe('answering');
  });
});
