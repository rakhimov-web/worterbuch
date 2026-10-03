import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, Flag, Search, X } from 'lucide-react';
import { getLesson, type Lesson, type VocabEntry } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProgress } from '../hooks/useProgress';
import { useSpeech } from '../hooks/useSpeech';
import { matchesQuery } from '../lib/search';
import { speechText } from '../lib/speech';
import { LessonHeader } from '../components/LessonHeader';
import { AudioButton } from '../components/AudioButton';
import { NotFound } from './NotFound';

type Filter = 'all' | 'todo' | 'difficult';
const parseFilter = (v: string | null): Filter => (v === 'todo' || v === 'difficult' ? v : 'all');

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
  return (
    <li className={`word${learned ? ' is-learned' : ''}${difficult ? ' is-difficult' : ''}`}>
      <div>
        <p className="de" lang="de">{entry.de}</p>
        <p className="uz" lang="uz">{entry.uz}</p>
        <p className="pron">{entry.pron}</p>
        {(learned || difficult) && (
          <div className="tags">
            {learned && <span className="tag"><Check aria-hidden="true" />Yodlangan</span>}
            {difficult && <span className="tag"><Flag aria-hidden="true" />Qiyin</span>}
          </div>
        )}
      </div>
      <div className="row-actions">
        <AudioButton label={entry.de} supported={speechSupported} speaking={speakingId === entry.id} onPlay={() => onSpeak(entry)} />
        <button type="button" className="icon-btn" aria-pressed={learned} aria-label={`${entry.de}: ${learnedLabel}`} title={learnedLabel} onClick={() => onToggle(entry.id, 'learned')}>
          <Check aria-hidden="true" />
        </button>
        <button type="button" className="icon-btn" aria-pressed={difficult} aria-label={`${entry.de}: ${difficultLabel}`} title={difficultLabel} onClick={() => onToggle(entry.id, 'difficult')}>
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
  const filters: [Filter, string][] = [['all', 'Hammasi'], ['todo', 'Yodlanmagan'], ['difficult', 'Qiyin']];

  return (
    <>
      <LessonHeader lesson={lesson} learned={learned.size} />

      <div className="search" role="search">
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="q">So‘zlarni qidirish</label>
        <input id="q" className="input" type="search" inputMode="search" autoComplete="off" placeholder="Nemischa yoki o‘zbekcha qidiring" value={query} onChange={(e) => setQuery(e.target.value)} />
        {query && (
          <button type="button" className="clear" aria-label="Qidiruvni tozalash" onClick={() => setQuery('')}><X size={18} aria-hidden="true" /></button>
        )}
      </div>

      <div className="filters" role="group" aria-label="Filtr">
        {filters.map(([f, label]) => (
          <button key={f} type="button" className="pill" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {label} <span className="count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {missingGermanVoice && (
        <p className="note" role="note">
          Qurilmangizda nemis ovozi topilmadi, shuning uchun talaffuz boshqacha eshitilishi mumkin. Qurilma sozlamalaridan nemis tilini qo‘shing.
        </p>
      )}

      <p className="sr-only" role="status" aria-live="polite">{visible.length} ta so‘z ko‘rsatilmoqda</p>

      {visible.length > 0 ? (
        <ul className="words" aria-label="So‘zlar ro‘yxati">
          {visible.map((e) => (
            <WordRow key={e.id} entry={e} learned={learned.has(e.id)} difficult={difficult.has(e.id)} speakingId={speakingId} speechSupported={supported} onSpeak={(w) => speak(w.id, speechText(w.de, w.speak))} onToggle={toggle} />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <h2>{query ? 'Hech narsa topilmadi' : filter === 'difficult' ? 'Qiyin so‘zlar yo‘q' : 'Barcha so‘zlar yodlangan'}</h2>
          <p>{query ? 'Boshqa so‘z bilan urinib ko‘ring.' : filter === 'difficult' ? 'Qiyin deb belgilagan so‘zlaringiz shu yerda ko‘rinadi.' : 'Ajoyib! Testda o‘zingizni sinab ko‘ring.'}</p>
        </div>
      )}
    </>
  );
}

export function Vocabulary() {
  const lesson = getLesson(useParams().slug);
  return lesson ? <VocabularyView lesson={lesson} /> : <NotFound />;
}
