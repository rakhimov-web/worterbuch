export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

const lang = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();

/** Prefer de-DE, then any German voice; prefer on-device voices (work offline, start faster). */
export function pickGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const score = (v: SpeechSynthesisVoice) => (lang(v) === 'de-de' ? 4 : 0) + (v.localService ? 1 : 0);
  const german = voices.filter((v) => lang(v) === 'de' || lang(v).startsWith('de-'));
  return german.sort((a, b) => score(b) - score(a))[0] ?? null;
}

/** Text to read aloud: fall back to the printed German with bracket notes and plural marks removed. */
export function speechText(de: string, speak?: string): string {
  if (speak) return speak;
  return de.replace(/\(.*?\)/g, '').replace(/,\s*¨?-\w*/g, '').replace(/\s*\/\s*/g, ', ').replace(/\s+/g, ' ').trim();
}
