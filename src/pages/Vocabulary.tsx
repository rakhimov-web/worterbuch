import { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, Flag, Search, X, List, Layers } from 'lucide-react';
import { getLesson, type Lesson, type VocabEntry } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProgress } from '../hooks/useProgress';
import { useSpeech } from '../hooks/useSpeech';
import { matchesQuery } from '../lib/search';
import { speechText } from '../lib/speech';
import { LessonHeader } from '../components/LessonHeader';
import { AudioButton } from '../components/AudioButton';
import { Flashcards } from '../components/Flashcards';
import { Input } from '@/components/ui/input';
import { NotFound } from './NotFound';

type Filter = 'all' | 'todo' | 'difficult';
type ViewMode = 'list' | 'cards';

const parseFilter = (v: string | null): Filter => (v === 'todo' || v === 'difficult' ? v : 'all');

const KIND_LABELS: Record<string, string> = {
  noun: 'Ot',
  verb: 'Fe’l',
  phrase: 'Ibora',
  pronoun: 'Olmosh',
  country: 'Davlat',
};

function GermanWord({ text }: { text: string }) {
  const match = text.match(/^(der|die|das)\s+(.*)$/i);
  if (match) {
    const art = match[1].toLowerCase();
    const isPlural = text.includes('(Pl.)');
    const artVariant = isPlural
      ? 'pl'
      : art === 'der'
      ? 'der'
      : art === 'die'
      ? 'die'
      : 'das';
    return (
      <span className="de" lang="de">
        <span className={`article-pill article-${artVariant}`}>
          {match[1]}
        </span>
        <span className="de-text">{match[2]}</span>
      </span>
    );
  }
  return <span className="de" lang="de"><span className="de-text">{text}</span></span>;
}

interface RowProps {
  entry: VocabEntry;
  learned: boolean;
  difficult: boolean;
  speakingId: string | null;
  speechSupported: boolean;
  onSpeak: (e: VocabEntry) => void;
  onToggle: (id: string, flag: 'learned' | 'difficult') => void;
}

function WordRow({ entry, learned, difficult, speakingId, speechSupported, onSpeak, onToggle }: RowProps) {
  const learnedLabel = learned ? 'Yodlangan, belgini olib tashlash' : 'Yodladim deb belgilash';
  const difficultLabel = difficult ? 'Qiyin so‘z, belgini olib tashlash' : 'Qiyin so‘z deb belgilash';
  const kindLabel = entry.kind && KIND_LABELS[entry.kind];

  return (
    <li className={`word${learned ? ' is-learned' : ''}${difficult ? ' is-difficult' : ''}`}>
      <div className="word-content">
        <GermanWord text={entry.de} />
        <p className="uz" lang="uz">{entry.uz}</p>
        {entry.pron && (
          <p className="pron">
            <span className="pron-label">o‘qilishi:</span>
            <span className="pron-val">[{entry.pron}]</span>
          </p>
        )}
        {(kindLabel || learned || difficult) && (
          <div className="tags">
            {kindLabel && <span className="status-badge status-badge-kind">{kindLabel}</span>}
            {learned && (
              <span className="status-badge status-badge-learned">
                <Check aria-hidden="true" size={13} style={{ flexShrink: 0 }} />
                <span>Yodlangan</span>
              </span>
            )}
            {difficult && (
              <span className="status-badge status-badge-difficult">
                <Flag aria-hidden="true" size={13} style={{ flexShrink: 0 }} />
                <span>Qiyin so‘z</span>
              </span>
            )}
          </div>
        )}
      </div>
      <div className="row-actions">
        <AudioButton
          label={entry.de}
          supported={speechSupported}
          speaking={speakingId === entry.id}
          onPlay={() => onSpeak(entry)}
        />
        <button
          type="button"
          className={`icon-btn${learned ? ' is-active-learned' : ''}`}
          aria-pressed={learned}
          aria-label={`${entry.de}: ${learnedLabel}`}
          title={learnedLabel}
          onClick={() => onToggle(entry.id, 'learned')}
        >
          <Check aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`icon-btn${difficult ? ' is-active-difficult' : ''}`}
          aria-pressed={difficult}
          aria-label={`${entry.de}: ${difficultLabel}`}
          title={difficultLabel}
          onClick={() => onToggle(entry.id, 'difficult')}
        >
          <Flag aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function VocabularyView({ lesson }: { lesson: Lesson }) {
  usePageTitle(`${lesson.level} ${lesson.title} · So‘zlar`);
  const ids = useMemo(() => lesson.entries.map((e) => e.id), [lesson]);
  const { learned, difficult, toggle } = useProgress(lesson.slug, ids);
  const { supported, speak, speakingId, missingGermanVoice } = useSpeech();
  const [params, setParams] = useSearchParams();
  const filter = parseFilter(params.get('filter'));
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');

  useEffect(() => {
    try {
      localStorage.setItem('last_visited_lesson', lesson.slug);
    } catch {
      // ignore
    }
  }, [lesson.slug]);

  const counts = { all: ids.length, todo: ids.filter((id) => !learned.has(id)).length, difficult: difficult.size };
  const visible = useMemo(
    () =>
      lesson.entries.filter((e) => {
        if (filter === 'todo' && learned.has(e.id)) return false;
        if (filter === 'difficult' && !difficult.has(e.id)) return false;
        return matchesQuery([e.de, e.uz], query);
      }),
    [lesson, filter, learned, difficult, query],
  );

  const setFilter = (f: Filter) => setParams(f === 'all' ? {} : { filter: f }, { replace: true });
  const filters: [Filter, string][] = [
    ['all', 'Hammasi'],
    ['todo', 'Yodlanmagan'],
    ['difficult', 'Qiyin'],
  ];

  return (
    <>
      <LessonHeader lesson={lesson} learned={learned.size} />

      {/* Search Input */}
      <div className="search" role="search">
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="q">So‘zlarni qidirish</label>
        <Input
          id="q"
          className="input pl-11 pr-11"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Nemischa yoki o‘zbekcha qidiring"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" className="clear" aria-label="Qidiruvni tozalash" onClick={() => setQuery('')}>
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filters and View Switch */}
      <div className="filters-bar">
        <div className="filters" role="group" aria-label="Filtr">
          {filters.map(([f, label]) => (
            <button key={f} type="button" className="pill" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {label} <span className="count">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="view-switch" role="group" aria-label="Ko‘rinish rejimi">
          <div
            className="view-glider"
            style={{
              transform: view === 'cards' ? 'translateX(100%)' : 'translateX(0%)',
            }}
            aria-hidden="true"
          />
          <button
            type="button"
            className={`view-btn${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}
            aria-label="Ro‘yxat ko‘rinishi"
            title="Ro‘yxat"
          >
            <List size={15} aria-hidden="true" />
            <span>Ro‘yxat</span>
          </button>
          <button
            type="button"
            className={`view-btn${view === 'cards' ? ' active' : ''}`}
            onClick={() => setView('cards')}
            aria-label="Kartochkalar ko‘rinishi"
            title="Kartochkalar"
          >
            <Layers size={15} aria-hidden="true" />
            <span>Kartochkalar</span>
          </button>
        </div>
      </div>

      {missingGermanVoice && (
        <p className="note" role="note">
          Qurilmangizda nemis ovozi topilmadi, shuning uchun talaffuz boshqacha eshitilishi mumkin. Qurilma sozlamalaridan nemis tilini qo‘shing.
        </p>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} ta so‘z ko‘rsatilmoqda
      </p>

      {/* Content: List or Flashcards */}
      {view === 'cards' ? (
        <Flashcards
          entries={visible}
          learned={learned}
          difficult={difficult}
          speakingId={speakingId}
          speechSupported={supported}
          onSpeak={(text, id) => speak(id, text)}
          onToggle={toggle}
        />
      ) : visible.length > 0 ? (
        <ul className="words" aria-label="So‘zlar ro‘yxati">
          {visible.map((e) => (
            <WordRow
              key={e.id}
              entry={e}
              learned={learned.has(e.id)}
              difficult={difficult.has(e.id)}
              speakingId={speakingId}
              speechSupported={supported}
              onSpeak={(w) => speak(w.id, speechText(w.de, w.speak))}
              onToggle={toggle}
            />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <h2>{query ? 'Hech narsa topilmadi' : filter === 'difficult' ? 'Qiyin so‘zlar yo‘q' : 'Barcha so‘zlar yodlangan'}</h2>
          <p>
            {query
              ? 'Boshqa so‘z bilan urinib ko‘ring.'
              : filter === 'difficult'
              ? 'Qiyin deb belgilagan so‘zlaringiz shu yerda ko‘rinadi.'
              : 'Ajoyib! Testda o‘zingizni sinab ko‘ring.'}
          </p>
        </div>
      )}
    </>
  );
}

export function Vocabulary() {
  const lesson = getLesson(useParams().slug);
  return lesson ? <VocabularyView lesson={lesson} /> : <NotFound />;
}
