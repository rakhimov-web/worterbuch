import { useState, useEffect } from 'react';
import { Volume2, RotateCw, ChevronLeft, ChevronRight, Check, Flag } from 'lucide-react';
import type { VocabEntry } from '../data';
import { preloadGermanAudio, speechText } from '../lib/speech';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  entries: VocabEntry[];
  learned: Set<string>;
  difficult: Set<string>;
  speakingId: string | null;
  speechSupported: boolean;
  onSpeak: (text: string, id: string) => void;
  onToggle: (id: string, flag: 'learned' | 'difficult') => void;
}

export function Flashcards({
  entries,
  learned,
  difficult,
  speakingId,
  speechSupported,
  onSpeak,
  onToggle,
}: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = entries[Math.min(index, entries.length - 1)];

  useEffect(() => {
    if (!current) return;
    preloadGermanAudio(speechText(current.de, current.speak));
    const nextEntry = entries[(index + 1) % entries.length];
    if (nextEntry) {
      preloadGermanAudio(speechText(nextEntry.de, nextEntry.speak));
    }
  }, [current, index, entries]);

  if (entries.length === 0) {
    return (
      <div className="empty">
        <h2>Kartochkalar mavjud emas</h2>
        <p>Boshqa filtrni tanlang yoki qidiruvni tozalang.</p>
      </div>
    );
  }

  const isLearned = learned.has(current.id);
  const isDifficult = difficult.has(current.id);

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i > 0 ? i - 1 : entries.length - 1));
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i < entries.length - 1 ? i + 1 : 0));
  };

  const articleMatch = current.de.match(/^(der|die|das)\s+(.*)$/i);
  const article = articleMatch ? articleMatch[1].toLowerCase() : null;
  const isPlural = current.de.includes('(Pl.)');
  const artVariant = isPlural
    ? 'pl'
    : article === 'der'
    ? 'der'
    : article === 'die'
    ? 'die'
    : 'das';

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <span>Kartochka <strong>{index + 1}</strong> / {entries.length}</span>
        <span>Aylantirish uchun ustiga bosing</span>
      </div>

      <div className="flashcard-deck-progress" aria-hidden="true">
        <div
          className="flashcard-deck-bar"
          style={{ width: `${((index + 1) / entries.length) * 100}%` }}
        />
      </div>

      <div className="flashcard-stage">
        <div
          className={`flashcard${flipped ? ' is-flipped' : ''}`}
          onClick={() => setFlipped(!flipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              setFlipped(!flipped);
            }
          }}
          aria-label={`${current.de} kartochkasi`}
        >
          {/* Front (Deutsch) */}
          <div className="card-face front">
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <button
                type="button"
                className={`icon-btn${speakingId === current.id ? ' is-speaking' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(speechText(current.de, current.speak), current.id);
                }}
                disabled={!speechSupported}
                title="Talaffuzni eshitish"
                aria-label={`Eshitish: ${current.de}`}
              >
                <Volume2 size={18} aria-hidden="true" />
              </button>
            </div>

            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {articleMatch ? (
                <span className="flashcard-prompt" lang="de" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Badge variant={artVariant} className="text-xl px-3 py-1 font-bold" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {articleMatch[1]}
                  </Badge>
                  <span>{articleMatch[2]}</span>
                </span>
              ) : (
                <span className="flashcard-prompt" lang="de">{current.de}</span>
              )}
            </div>

            <div className="pron-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>[{current.pron}]</div>
            <p className="flashcard-hint" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RotateCw size={14} aria-hidden="true" style={{ display: 'block', flexShrink: 0 }} />
              <span>Tarjimasini ko‘rish uchun bosing</span>
            </p>
          </div>

          {/* Back (Uzbek) */}
          <div className="card-face back">
            <div className="flashcard-answer" lang="uz">{current.uz}</div>
            <div style={{ marginTop: 12, fontSize: 15, color: '#64748B' }}>
              Nemischa: <strong>{current.de}</strong>
            </div>
            <p className="flashcard-hint">Oldingi holatga qaytish uchun bosing</p>
          </div>
        </div>
      </div>

      {/* Card Action & Navigation Controls */}
      <div className="flashcard-controls">
        <Button variant="outline" onClick={prev} aria-label="Oldingi kartochka">
          <ChevronLeft size={18} aria-hidden="true" /> Oldingi
        </Button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className={`icon-btn${isLearned ? ' is-active-learned' : ''}`}
            aria-pressed={isLearned}
            onClick={() => onToggle(current.id, 'learned')}
            title={isLearned ? 'Yodlangan, olib tashlash' : 'Yodladim deb belgilash'}
          >
            <Check size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`icon-btn${isDifficult ? ' is-active-difficult' : ''}`}
            aria-pressed={isDifficult}
            onClick={() => onToggle(current.id, 'difficult')}
            title={isDifficult ? 'Qiyin so‘z, olib tashlash' : 'Qiyin deb belgilash'}
          >
            <Flag size={18} aria-hidden="true" />
          </button>
        </div>

        <Button onClick={next} aria-label="Keyingi kartochka">
          Keyingi <ChevronRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
