import { lessons } from './index';

describe('vocabulary data', () => {
  it.each(lessons.map((l) => [l.slug, l] as const))('%s matches its source row count', (_s, lesson) => {
    expect(lesson.entries).toHaveLength(lesson.sourceCount);
  });

  it('has unique IDs, unique slugs and no empty fields', () => {
    expect(new Set(lessons.map((l) => l.slug)).size).toBe(lessons.length);
    for (const l of lessons) {
      expect(new Set(l.entries.map((e) => e.id)).size).toBe(l.entries.length);
      for (const e of l.entries) {
        expect(e.de.trim()).not.toBe('');
        expect(e.uz.trim()).not.toBe('');
        expect(e.pron.trim()).not.toBe('');
      }
    }
  });

  it('keeps umlauts, ß and articles from the source', () => {
    const de = lessons[0].entries.map((e) => e.de);
    expect(de).toContain('heißt (heißen)');
    expect(de).toContain('Tschüs');
    expect(de).toContain('die Türkei');
    expect(de).toContain('Österreich');
    expect(de).toContain('das Gespräch, -e');
    expect(de).toContain('das Land, ¨-er');
  });
});
