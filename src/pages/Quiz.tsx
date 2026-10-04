import { useEffect, useMemo, useReducer, useRef, useState, useCallback } from 'react';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { ArrowRight, Check, Flag, RotateCcw, X, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLesson, type Lesson } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProgress } from '../hooks/useProgress';
import { useSpeech } from '../hooks/useSpeech';
import { speechText } from '../lib/speech';
import { buildRound, roundReducer, startRound, summarize, MIN_LESSON_WORDS, type DirectionMode } from '../quiz/engine';
import { LessonHeader } from '../components/LessonHeader';
import { AudioButton } from '../components/AudioButton';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Badge } from '@/components/ui/badge';
import { NotFound } from './NotFound';
import type { LessonOutletContext } from './LessonLayout';

type Scope = 'all' | 'todo' | 'difficult';

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

function QuizView({ lesson, hideHeader = false }: { lesson: Lesson; hideHeader?: boolean }) {
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
  const outlet = useOutletContext<LessonOutletContext | null>();

  useEffect(() => {
    outlet?.setIsQuizActive?.(active);
  }, [active, outlet]);

  const scopeIds = useMemo(
    () => (scope === 'todo' ? ids.filter((id) => !learned.has(id)) : scope === 'difficult' ? ids.filter((id) => difficult.has(id)) : ids),
    [scope, ids, learned, difficult],
  );
  const tooSmall = lesson.entries.length < MIN_LESSON_WORDS;

  // Keyboard navigation handler (1, 2, 3, 4 to choose, Enter to proceed)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active || round.phase === 'done') return;
      const q = round.questions[round.index];
      if (!q) return;
      const answer = round.answers[q.id];

      // Number keys 1-4 or A-D
      if (!answer) {
        let selectedIdx = -1;
        if (['1', '2', '3', '4'].includes(e.key)) {
          selectedIdx = Number(e.key) - 1;
        } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
          selectedIdx = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase());
        }
        if (selectedIdx >= 0 && selectedIdx < q.options.length) {
          e.preventDefault();
          dispatch({ type: 'answer', choice: q.options[selectedIdx] });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        dispatch({ type: 'next' });
      }
    },
    [active, round],
  );

  useEffect(() => {
    try {
      localStorage.setItem('last_visited_lesson', lesson.slug);
    } catch {
      // ignore
    }
  }, [lesson.slug]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (round.phase === 'feedback') {
      nextRef.current?.focus();
    } else if (round.phase === 'done') {
      const summary = summarize(round);
      if (summary.total > 0 && summary.correct / summary.total >= 0.7) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#2563EB', '#D97706', '#E11D48', '#10B981'],
          });
        } catch {
          // ignore if canvas is unsupported
        }
      }
    }
  }, [round.phase, round.index, round]);

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
        {!hideHeader && <LessonHeader lesson={lesson} learned={learned.size} />}
        <div className="empty">
          <h2>Test uchun so‘zlar yetarli emas</h2>
          <p>Kamida {MIN_LESSON_WORDS} ta so‘z kerak.</p>
        </div>
      </>
    );
  }

  const summary = summarize(round);
  const q = round.questions[round.index];
  const answer = q ? round.answers[q.id] : undefined;
  const scopes: [Scope, string, number][] = [
    ['all', 'Barcha so‘zlar', ids.length],
    ['todo', 'Yodlanmaganlar', ids.filter((i) => !learned.has(i)).length],
    ['difficult', 'Qiyin so‘zlar', difficult.size],
  ];
  const modes: [DirectionMode, string][] = [
    ['mixed', 'Aralash'],
    ['de-uz', 'Nemis → O‘zbek'],
    ['uz-de', 'O‘zbek → Nemis'],
  ];

  return (
    <>
      {!hideHeader && <LessonHeader lesson={lesson} learned={learned.size} showProgress={!active} />}

      {!active && (
        <section aria-labelledby="setup-h" style={{ marginTop: 24, width: '100%' }}>
          <h2 id="setup-h" className="sr-only">Testni boshlash</h2>
          <fieldset>
            <legend>Qaysi so‘zlar?</legend>
            <div className="radio-row">
              {scopes.map(([v, label, n]) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="scope"
                    value={v}
                    checked={scope === v}
                    disabled={n === 0}
                    onChange={() => setScope(v)}
                  />
                  <span>
                    {label} ({n})
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Savol turi</legend>
            <div className="radio-row">
              {modes.map(([v, label]) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="mode"
                    value={v}
                    checked={mode === v}
                    onChange={() => setMode(v)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="quiet">Har bir so‘z testda bir martadan so‘raladi: {scopeIds.length} ta savol.</p>

          <div className="actions" style={{ width: '100%' }}>
            <button
              type="button"
              className="btn"
              style={{ width: '100%' }}
              disabled={scopeIds.length === 0}
              onClick={() => begin(scopeIds)}
            >
              Boshlash
            </button>
          </div>
        </section>
      )}

      {active && round.phase !== 'done' && q && (
        <section aria-labelledby="q-h" className="quiz-active-section">
          <div className="progress">
            <div className="progress-text">
              <span>
                Savol <strong>{round.index + 1}</strong> / {round.questions.length}
              </span>
              {retryNote && <Badge variant="warning" className="font-bold">Qayta ishlash</Badge>}
            </div>
            <div className="bar" aria-hidden="true">
              <i style={{ transform: `scaleX(${round.index / round.questions.length})` }} />
            </div>
          </div>

          <div className="quiz-question-box">
            <p className="q-label">
              {q.direction === 'de-uz' ? 'Bu so‘z o‘zbekchada nima?' : 'Bu nemischada qanday aytiladi?'}
            </p>

            <div className="q-prompt">
              <h2 id="q-h" lang={q.direction === 'de-uz' ? 'de' : 'uz'}>
                {q.prompt}
              </h2>
              {q.direction === 'de-uz' && (
                <AudioButton
                  label={q.prompt}
                  supported={supported}
                  speaking={speakingId === q.entryId}
                  onPlay={() => {
                    const e = byId.get(q.entryId)!;
                    speak(e.id, speechText(e.de, e.speak));
                  }}
                />
              )}
            </div>

            <div className="opts" role="group" aria-label="Javob variantlari">
              {q.options.map((o, idx) => {
                const chosen = answer?.choice === o;
                const right = !!answer && q.acceptable.includes(o);
                const cls = answer ? (right ? ' ok' : chosen ? ' bad' : '') : '';
                return (
                  <button
                    key={o}
                    type="button"
                    className={`choice${cls}`}
                    disabled={!!answer}
                    lang={q.direction === 'de-uz' ? 'uz' : 'de'}
                    onClick={() => dispatch({ type: 'answer', choice: o })}
                  >
                    <span className="choice-key">{OPTION_KEYS[idx] || idx + 1}</span>
                    <span>{o}</span>
                    {right && <Check className="mark" aria-label="To‘g‘ri javob" />}
                    {chosen && !right && <X className="mark" aria-label="Siz tanlagan noto‘g‘ri javob" />}
                  </button>
                );
              })}
            </div>

            <div role="status" aria-live="polite">
              {answer && (
                <p className={`feedback ${answer.correct ? 'correct' : 'incorrect'}`}>
                  {answer.correct ? <Check aria-hidden="true" size={20} /> : <X aria-hidden="true" size={20} />}
                  <span>
                    {answer.correct ? (
                      'Barakalla, to‘g‘ri javob!'
                    ) : (
                      <>
                        Noto‘g‘ri. To‘g‘ri javob:{' '}
                        <strong>{q.options.find((o) => q.acceptable.includes(o))}</strong>
                      </>
                    )}
                  </span>
                </p>
              )}
            </div>

            <div className="actions" style={{ width: '100%' }}>
              <button
                ref={nextRef}
                type="button"
                className="btn block"
                style={{ width: '100%' }}
                disabled={!answer}
                onClick={() => dispatch({ type: 'next' })}
              >
                {round.index + 1 === round.questions.length ? 'Natijani ko‘rish' : 'Davom etish'}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="quiet">
            Test davomida belgilangan so‘zlar saqlanadi.{' '}
            <Link to={`/${lesson.slug}/vocabulary`} className="quiz-return-link">
              So‘zlarga qaytish
            </Link>{' '}
            testni boshidan boshlaydi.
          </p>
        </section>
      )}

      {active && round.phase === 'done' && (
        <section aria-labelledby="res-h" className="card q-result-card" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 id="res-h" className="eyebrow">
                Natija
              </h2>
              <p className="score" tabIndex={-1}>
                {summary.correct} / {summary.total}
              </p>
              <p className="stats">
                <span>
                  <strong>{summary.correct}</strong> to‘g‘ri
                </span>
                <span>
                  <strong>{summary.incorrect}</strong> noto‘g‘ri
                </span>
              </p>
            </div>
            <CircularProgress
              value={summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0}
              size={84}
              strokeWidth={8}
              color={summary.correct / summary.total >= 0.8 ? '#10B981' : summary.correct / summary.total >= 0.5 ? '#F59E0B' : '#EF4444'}
              trackColor="#F1F5F9"
            >
              <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                {summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0}%
              </span>
            </CircularProgress>
          </div>

          {summary.missedIds.length > 0 ? (
            <div className="missed">
              <h3>Xato qilingan so‘zlar ({summary.missedIds.length})</h3>
              <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
                Quyidagi so‘zlarni qayta eshitib, yodlab oling:
              </p>
              <ul>
                {summary.missedIds.map((id) => {
                  const e = byId.get(id)!;
                  return (
                    <li key={id}>
                      <div>
                        <span className="de" lang="de">{e.de}</span>
                        <span className="uz" lang="uz"> — {e.uz}</span>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>[{e.pron}]</div>
                      </div>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => speak(e.id, speechText(e.de, e.speak))}
                        disabled={!supported}
                        title={`Eshitish: ${e.de}`}
                        aria-label={`Eshitish: ${e.de}`}
                      >
                        <Volume2 size={16} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="lede" style={{ marginTop: 12, color: '#059669', fontWeight: 600 }}>
              Hamma javoblar to‘g‘ri! Siz Lektion 1 so‘zlarini 100% mukammal o‘zlashtirdingiz. 🎉
            </p>
          )}

          <div className="actions" style={{ marginTop: 24 }}>
            {summary.missedIds.length > 0 && (
              <button type="button" className="btn" onClick={() => begin(summary.missedIds, true)}>
                <RotateCcw aria-hidden="true" /> Qayta ishlash
              </button>
            )}
            {summary.missedIds.some((id) => !difficult.has(id)) && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => addDifficult(summary.missedIds)}
              >
                <Flag aria-hidden="true" /> Qiyin deb belgilash
              </button>
            )}
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                stop();
                setActive(false);
              }}
            >
              Yangi test
            </button>
            <Link
              className="btn ghost"
              to={`/${lesson.slug}/vocabulary${difficult.size ? '?filter=difficult' : ''}`}
            >
              So‘zlarga qaytish
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export function Quiz({ hideHeader = false }: { hideHeader?: boolean }) {
  const lesson = getLesson(useParams().slug);
  return lesson ? <QuizView lesson={lesson} hideHeader={hideHeader} /> : <NotFound />;
}
