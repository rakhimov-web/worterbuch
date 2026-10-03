import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Flag, RotateCcw, X } from 'lucide-react';
import { getLesson, type Lesson } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProgress } from '../hooks/useProgress';
import { useSpeech } from '../hooks/useSpeech';
import { speechText } from '../lib/speech';
import { buildRound, roundReducer, startRound, summarize, MIN_LESSON_WORDS, type DirectionMode } from '../quiz/engine';
import { LessonHeader } from '../components/LessonHeader';
import { AudioButton } from '../components/AudioButton';
import { NotFound } from './NotFound';

type Scope = 'all' | 'todo' | 'difficult';

function QuizView({ lesson }: { lesson: Lesson }) {
  usePageTitle(`${lesson.level} ${lesson.title} · Test`);
  const ids = useMemo(() => lesson.entries.map((e) => e.id), [lesson]);
  const byId = useMemo(() => new Map(lesson.entries.map((e) => [e.id, e])), [lesson]);
  const { learned, difficult, addDifficult } = useProgress(lesson.slug, ids);
  const { supported, speak, speakingId, stop } = useSpeech();

  const [scope, setScope] = useState<Scope>('all');
  const [mode, setMode] = useState<DirectionMode>('mixed');
  const [round, dispatch] = useReducer(roundReducer, undefined, () => startRound([]));
  const [active, setActive] = useState(false);
  const [retryNote, setRetryNote] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  const scopeIds = useMemo(
    () => (scope === 'todo' ? ids.filter((id) => !learned.has(id)) : scope === 'difficult' ? ids.filter((id) => difficult.has(id)) : ids),
    [scope, ids, learned, difficult],
  );
  const tooSmall = lesson.entries.length < MIN_LESSON_WORDS;

  useEffect(() => {
    if (round.phase === 'feedback') nextRef.current?.focus();
  }, [round.phase, round.index]);

  const begin = (wordIds: string[], note = false) => {
    stop();
    const questions = buildRound(lesson.entries, wordIds, mode);
    if (!questions.length) return;
    dispatch({ type: 'restart', round: startRound(questions) });
    setRetryNote(note);
    setActive(true);
  };

  if (tooSmall) {
    return (
      <>
        <LessonHeader lesson={lesson} learned={learned.size} />
        <div className="empty"><h2>Test uchun so‘zlar yetarli emas</h2><p>Kamida {MIN_LESSON_WORDS} ta so‘z kerak.</p></div>
      </>
    );
  }

  const summary = summarize(round);
  const q = round.questions[round.index];
  const answer = q ? round.answers[q.id] : undefined;
  const scopes: [Scope, string, number][] = [['all', 'Barcha so‘zlar', ids.length], ['todo', 'Yodlanmaganlar', ids.filter((i) => !learned.has(i)).length], ['difficult', 'Qiyin so‘zlar', difficult.size]];
  const modes: [DirectionMode, string][] = [['mixed', 'Aralash'], ['de-uz', 'Nemis → O‘zbek'], ['uz-de', 'O‘zbek → Nemis']];

  return (
    <>
      <LessonHeader lesson={lesson} learned={learned.size} />

      {!active && (
        <section aria-labelledby="setup-h">
          <h2 id="setup-h" className="sr-only">Testni boshlash</h2>
          <fieldset>
            <legend>Qaysi so‘zlar?</legend>
            <div className="radio-row">
              {scopes.map(([v, label, n]) => (
                <label key={v}>
                  <input type="radio" name="scope" value={v} checked={scope === v} disabled={n === 0} onChange={() => setScope(v)} />
                  <span>{label} ({n})</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Savol turi</legend>
            <div className="radio-row">
              {modes.map(([v, label]) => (
                <label key={v}>
                  <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="quiet">Har bir so‘z testda bir martadan so‘raladi: {scopeIds.length} ta savol.</p>
          <div className="actions">
            <button type="button" className="btn" disabled={scopeIds.length === 0} onClick={() => begin(scopeIds)}>Boshlash</button>
          </div>
        </section>
      )}

      {active && round.phase !== 'done' && q && (
        <section aria-labelledby="q-h">
          <div className="progress">
            <div className="progress-text"><span>Savol <strong>{round.index + 1}</strong> / {round.questions.length}</span>{retryNote && <span>Qayta ishlash</span>}</div>
            <div className="bar" aria-hidden="true"><i style={{ transform: `scaleX(${round.index / round.questions.length})` }} /></div>
          </div>
          <div className="card q-card">
            <p className="q-label">{q.direction === 'de-uz' ? 'Bu so‘z o‘zbekchada nima?' : 'Bu nemischada qanday aytiladi?'}</p>
            <div className="q-prompt">
              <h2 id="q-h" lang={q.direction === 'de-uz' ? 'de' : 'uz'}>{q.prompt}</h2>
              {q.direction === 'de-uz' && (
                <AudioButton label={q.prompt} supported={supported} speaking={speakingId === q.entryId} onPlay={() => { const e = byId.get(q.entryId)!; speak(e.id, speechText(e.de, e.speak)); }} />
              )}
            </div>
            <div className="opts" role="group" aria-label="Javob variantlari">
              {q.options.map((o) => {
                const chosen = answer?.choice === o;
                const right = !!answer && q.acceptable.includes(o);
                const cls = answer ? (right ? ' ok' : chosen ? ' bad' : '') : '';
                return (
                  <button key={o} type="button" className={`choice${cls}`} disabled={!!answer} lang={q.direction === 'de-uz' ? 'uz' : 'de'} onClick={() => dispatch({ type: 'answer', choice: o })}>
                    <span>{o}</span>
                    {right && <Check className="mark" aria-label="To‘g‘ri javob" />}
                    {chosen && !right && <X className="mark" aria-label="Siz tanlagan noto‘g‘ri javob" />}
                  </button>
                );
              })}
            </div>
            <div role="status" aria-live="polite">
              {answer && (
                <p className="feedback">
                  {answer.correct ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                  <span>{answer.correct ? 'To‘g‘ri!' : <>Noto‘g‘ri. To‘g‘ri javob: <strong>{q.options.find((o) => q.acceptable.includes(o))}</strong></>}</span>
                </p>
              )}
            </div>
            <div className="actions">
              <button ref={nextRef} type="button" className="btn" disabled={!answer} onClick={() => dispatch({ type: 'next' })}>
                {round.index + 1 === round.questions.length ? 'Natijani ko‘rish' : 'Davom etish'}<ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="quiet">Test davomida belgilangan so‘zlar saqlanadi. <Link to={`/${lesson.slug}/vocabulary`}>So‘zlarga qaytish</Link> testni boshidan boshlaydi.</p>
        </section>
      )}

      {active && round.phase === 'done' && (
        <section aria-labelledby="res-h" className="card q-card">
          <h2 id="res-h" className="eyebrow">Natija</h2>
          <p className="score" tabIndex={-1}>{summary.correct} / {summary.total}</p>
          <p className="stats"><span><strong>{summary.correct}</strong> to‘g‘ri</span><span><strong>{summary.incorrect}</strong> noto‘g‘ri</span></p>
          {summary.missedIds.length > 0 ? (
            <div className="missed">
              <h3>Xato qilingan so‘zlar</h3>
              <ul>
                {summary.missedIds.map((id) => {
                  const e = byId.get(id)!;
                  return <li key={id}><span className="de" lang="de">{e.de}</span><span className="uz" lang="uz"> {e.uz}</span></li>;
                })}
              </ul>
            </div>
          ) : (
            <p className="lede">Hamma javoblar to‘g‘ri. Zo‘r natija!</p>
          )}
          <div className="actions">
            {summary.missedIds.length > 0 && (
              <button type="button" className="btn" onClick={() => begin(summary.missedIds, true)}><RotateCcw aria-hidden="true" />Qayta ishlash</button>
            )}
            {summary.missedIds.some((id) => !difficult.has(id)) && (
              <button type="button" className="btn ghost" onClick={() => addDifficult(summary.missedIds)}><Flag aria-hidden="true" />Qiyin deb belgilash</button>
            )}
            <button type="button" className="btn ghost" onClick={() => { stop(); setActive(false); }}>Yangi test</button>
            <Link className="btn ghost" to={`/${lesson.slug}/vocabulary${difficult.size ? '?filter=difficult' : ''}`}>So‘zlarga qaytish</Link>
          </div>
        </section>
      )}
    </>
  );
}

export function Quiz() {
  const lesson = getLesson(useParams().slug);
  return lesson ? <QuizView lesson={lesson} /> : <NotFound />;
}
