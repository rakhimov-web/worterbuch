export type WordKind = 'noun' | 'verb' | 'pronoun' | 'phrase' | 'word' | 'country' | 'adjective' | 'number';

export interface VocabEntry {
  /** Stable ID. Never change after release: saved progress is keyed by it. */
  id: string;
  /** German term exactly as printed in the source (articles, plural marks, brackets kept). */
  de: string;
  /** Uzbek translation exactly as printed in the source. */
  uz: string;
  /** Learner-friendly Latin-letter pronunciation aid (not IPA). Reviewed by hand per word. */
  pron: string;
  kind: WordKind;
  /** Text sent to speech synthesis when it differs from `de` (e.g. brackets/plural marks removed). */
  speak?: string;
}

export interface Lesson {
  /** URL slug, e.g. "a1.1-lektion-1" */
  slug: string;
  level: string;
  title: string;
  /** Number of vocabulary rows counted in the source document. Used by the completeness test. */
  sourceCount: number;
  entries: VocabEntry[];
}
