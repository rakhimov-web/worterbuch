import { createProgressStore, parseProgress, STORAGE_KEY } from './progress';
import { matchesQuery, normalize } from './search';
import { pickGermanVoice, speechText } from './speech';

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};

describe('progress storage', () => {
  it.each([null, '', 'not json', '[]', '{"version":2}', '{"version":1,"lessons":[]}', '{"version":1,"lessons":{"x":5}}'])(
    'survives bad data: %s',
    (raw) => expect(parseProgress(raw)).toEqual({ version: 1, lessons: {} }),
  );
  it('drops non-string ids and duplicates', () => {
    const s = parseProgress(JSON.stringify({ version: 1, lessons: { l: { learned: ['a', 'a', 3, null], difficult: 'x' } } }));
    expect(s.lessons.l).toEqual({ learned: ['a'], difficult: [] });
  });
  it('persists toggles and keeps the two flags independent', () => {
    const mem = memory();
    const store = createProgressStore(() => mem);
    store.toggle('l', 'w1', 'learned');
    store.toggle('l', 'w1', 'difficult');
    expect(createProgressStore(() => mem).getSnapshot().lessons.l).toEqual({ learned: ['w1'], difficult: ['w1'] });
    store.toggle('l', 'w1', 'learned');
    expect(JSON.parse(mem.m.get(STORAGE_KEY)!).lessons.l).toEqual({ learned: [], difficult: ['w1'] });
  });
  it('works in memory when storage throws', () => {
    const broken = () => { throw new Error('blocked'); };
    const store = createProgressStore(broken);
    expect(() => store.toggle('l', 'w', 'learned')).not.toThrow();
    expect(store.getSnapshot().lessons.l.learned).toEqual(['w']);
  });
});

describe('search', () => {
  it('folds umlauts, ß and Uzbek apostrophes', () => {
    expect(normalize('Tschüs')).toBe('tschus');
    expect(normalize('heißt')).toBe('heisst');
    expect(normalize("o‘rganadi")).toBe(normalize("o'rganadi"));
  });
  it('matches German and Uzbek fields', () => {
    expect(matchesQuery(['die Türkei', 'Turkiya'], 'turkei')).toBe(true);
    expect(matchesQuery(['Hallo', 'salom'], 'SAL')).toBe(true);
    expect(matchesQuery(['Hallo', 'salom'], 'xyz')).toBe(false);
    expect(matchesQuery(['Hallo', 'salom'], '  ')).toBe(true);
  });
});

describe('speech helpers', () => {
  const v = (lang: string, local = false) => ({ lang, localService: local, name: lang }) as SpeechSynthesisVoice;
  it('prefers de-DE and on-device voices, ignores non-German', () => {
    expect(pickGermanVoice([v('en-US'), v('de_AT'), v('de-DE')])?.lang).toBe('de-DE');
    expect(pickGermanVoice([v('en-US'), v('fr-FR')])).toBeNull();
    expect(pickGermanVoice([v('de-DE'), v('de-DE', true)])?.localService).toBe(true);
  });
  it('strips notes and plural marks for speech', () => {
    expect(speechText('der Name, -n')).toBe('der Name');
    expect(speechText('das Land, ¨-er')).toBe('das Land');
    expect(speechText('heißt (heißen)')).toBe('heißt');
    expect(speechText('x', 'override')).toBe('override');
  });
});
