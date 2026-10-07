import { Link } from 'react-router-dom';
import { ChevronRight, Award, ArrowRight, CheckCircle2, Check, Sparkles, BookOpen, TrendingUp, Volume2 } from 'lucide-react';
import { levelLabel, lessons } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSyncExternalStore, useState, useEffect } from 'react';
import { progressStore } from '../lib/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Badge } from '@/components/ui/badge';

function GermanyFlag() {
  return (
    <span className="de-flag-pill" aria-hidden="true">
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="de-flag-svg">
        <defs>
          <clipPath id="hero-de-flag-clip">
            <rect width="18" height="13" rx="2.5" />
          </clipPath>
        </defs>
        <g clipPath="url(#hero-de-flag-clip)">
          <rect width="18" height="4.33" fill="#18181b" />
          <rect y="4.33" width="18" height="4.34" fill="#dc2626" />
          <rect y="8.67" width="18" height="4.33" fill="#fbbf24" />
        </g>
      </svg>
    </span>
  );
}

export function Overview() {
  usePageTitle(`${levelLabel} darslari · Wörterbuch`);
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Find last visited lesson from localStorage
  const lastVisitedSlug = (typeof window !== 'undefined' && localStorage.getItem('last_visited_lesson')) || lessons[0].slug;
  const activeLesson = lessons.find((l) => l.slug === lastVisitedSlug) || lessons[0];

  // Overall course statistics across all lessons
  const totalWords = lessons.reduce((acc, l) => acc + l.entries.length, 0);
  const learnedCount = lessons.reduce((acc, l) => {
    const valid = new Set(l.entries.map((e) => e.id));
    return acc + (state.lessons[l.slug]?.learned ?? []).filter((id) => valid.has(id)).length;
  }, 0);
  const difficultCount = lessons.reduce((acc, l) => {
    const valid = new Set(l.entries.map((e) => e.id));
    return acc + (state.lessons[l.slug]?.difficult ?? []).filter((id) => valid.has(id)).length;
  }, 0);

  const progressPct = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const difficultPct = totalWords > 0 ? Math.round((difficultCount / totalWords) * 100) : 0;

  // Active lesson stats for resume card
  const activeValidIds = new Set(activeLesson.entries.map((e) => e.id));
  const activeLearned = (state.lessons[activeLesson.slug]?.learned ?? []).filter((id) => activeValidIds.has(id)).length;
  const activeTotal = activeLesson.entries.length;
  const isActiveCompleted = activeLearned === activeTotal && activeTotal > 0;
  const isActiveStarted = activeLearned > 0 && !isActiveCompleted;
  const isAllCompleted = learnedCount === totalWords && totalWords > 0;

  const resumeBadge = isAllCompleted
    ? 'Kurs yakunlandi 🎉'
    : isActiveCompleted
    ? 'Mustahkamlang 🎉'
    : isActiveStarted
    ? 'Davom ettirish'
    : 'Boshlash';

  const resumeHeadline = isAllCompleted
    ? 'Goethe A1.1 kursi to‘liq o‘zlashtirildi!'
    : isActiveCompleted
    ? `${activeLesson.title} — Bilimingizni mustahkamlang`
    : isActiveStarted
    ? `${activeLesson.title} — O‘rganishda davom eting`
    : `${activeLesson.title} — O‘rganishni boshlang`;

  const resumeSubtitle = isAllCompleted
    ? `Barcha ${totalWords} ta so‘z yodlangan, testlarda o‘zingizni sinang!`
    : isActiveCompleted
    ? `${activeTotal} ta so‘z to‘liq yodlangan, testda o‘zingizni sinang!`
    : isActiveStarted
    ? `${activeLearned} / ${activeTotal} ta so‘z yodlandi · yana ${activeTotal - activeLearned} ta qoldi`
    : `${activeTotal} ta muhim boshlang‘ich so‘z va iboralar`;

  return (
    <>
      {/* Header & Level Info */}
      <div className="overview-header">
        <div className="hero-eyebrow-badge">
          <GermanyFlag />
          <span className="hero-eyebrow-text">Nemis tili kursi · Goethe A1.1</span>
          <span className="hero-live-indicator" aria-hidden="true">
            <span className="hero-live-dot" />
          </span>
        </div>

        <h1 className="hero-page-title" tabIndex={-1}>
          <span className="hero-level-chip">
            <span className="hero-level-chip-label">{levelLabel}</span>
          </span>
          <span className="hero-title-text">darajasi</span>
        </h1>

        <p className="hero-lede">
          Darslikdagi so‘zlarni yodlang: talaffuz, audio va test bilan.
        </p>

        <div className="hero-feature-tags" role="list" aria-label="Kurs imkoniyatlari">
          <div className="hero-feature-tag" role="listitem">
            <Volume2 size={13} className="hero-feature-icon icon-audio" aria-hidden="true" />
            <span>Nemischa audio</span>
          </div>
          <div className="hero-feature-tag" role="listitem">
            <BookOpen size={13} className="hero-feature-icon icon-words" aria-hidden="true" />
            <span>{totalWords} ta so‘z</span>
          </div>
          <div className="hero-feature-tag" role="listitem">
            <Sparkles size={13} className="hero-feature-icon icon-quiz" aria-hidden="true" />
            <span>{lessons.length} ta dars & test</span>
          </div>
        </div>
      </div>

      {/* Overview Statistics (Display Flex 3-column row) */}
      <div className="stats-grid">
        {/* Stat 1: O'zlashtirish */}
        <div className="stat-item">
          <CircularProgress
            value={progressPct}
            size={isMobile ? 46 : 68}
            strokeWidth={isMobile ? 5 : 7}
            color="#2563eb"
            trackColor="#e2e8f0"
          >
            <TrendingUp size={isMobile ? 18 : 26} color="#2563eb" />
          </CircularProgress>
          <div className="stat-info">
            <span className="stat-label">O‘zlashtirish</span>
            <span className="stat-value">{progressPct}%</span>
            <span className="stat-sub">{learnedCount} / {totalWords} so‘z</span>
          </div>
        </div>

        {/* Stat 2: Yodlanganlar */}
        <div className="stat-item">
          <CircularProgress
            value={progressPct}
            size={isMobile ? 46 : 68}
            strokeWidth={isMobile ? 5 : 7}
            color="#10b981"
            trackColor="#e2e8f0"
          >
            <CheckCircle2 size={isMobile ? 18 : 26} color="#10b981" />
          </CircularProgress>
          <div className="stat-info">
            <span className="stat-label">Yodlangan</span>
            <span className="stat-value">{learnedCount} ta</span>
            <span className="stat-sub">barcha darslardan</span>
          </div>
        </div>

        {/* Stat 3: Qiyin so'zlar */}
        <div className="stat-item">
          <CircularProgress
            value={difficultPct}
            size={isMobile ? 46 : 68}
            strokeWidth={isMobile ? 5 : 7}
            color="#f59e0b"
            trackColor="#e2e8f0"
          >
            <Award size={isMobile ? 18 : 26} color="#f59e0b" />
          </CircularProgress>
          <div className="stat-info">
            <span className="stat-label">Qiyin so‘zlar</span>
            <span className="stat-value">{difficultCount} ta</span>
            <span className="stat-sub">takrorlashga</span>
          </div>
        </div>
      </div>

      {/* Quick Resume Hero Banner (100% Width & Vertically Centered Arrow) */}
      <div className="resume-hero-wrap">
        <Link
          to={`/${activeLesson.slug}/vocabulary`}
          aria-label="Davom ettirish"
          className="resume-hero-link"
        >
          <div className="resume-hero-content">
            <div className="resume-badge">
              <Sparkles size={isMobile ? 13 : 15} color="#ffffff" aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>{resumeBadge}</span>
            </div>
            <h2 className="resume-headline">
              {resumeHeadline}
            </h2>
            <p className="resume-subtitle">
              {resumeSubtitle}
            </p>
          </div>

          {/* Centered Large Arrow Icon */}
          <div className="resume-arrow-box">
            <ArrowRight size={isMobile ? 20 : 26} color="#ffffff" aria-hidden="true" />
          </div>
        </Link>
      </div>

      {/* Darslar ro‘yxati (Curriculum List - 100% Width) */}
      <div className="section-gap">
        <div className="section-header">
          <h2 className="section-title">
            Darslar rejasi
          </h2>
          <span className="section-count">
            {lessons.length} ta dars mavjud
          </span>
        </div>

        <ul className="lessons-list" aria-label={`${levelLabel} darslari`}>
          {lessons.map((l) => {
            const valid = new Set(l.entries.map((e) => e.id));
            const learned = (state.lessons[l.slug]?.learned ?? []).filter((id) => valid.has(id)).length;
            const pct = l.entries.length ? Math.round((learned / l.entries.length) * 100) : 0;

            return (
              <li key={l.slug} className="lesson-card-item">
                <Link className="lesson-link" to={`/${l.slug}/vocabulary`}>
                  <div className={`lesson-icon-box ${pct === 100 ? 'is-complete' : ''}`}>
                    {pct === 100 ? (
                      <CheckCircle2 size={isMobile ? 20 : 24} color="#059669" aria-hidden="true" />
                    ) : (
                      <BookOpen size={isMobile ? 18 : 24} color="#2563eb" aria-hidden="true" />
                    )}
                  </div>
                  <div className="grow">
                    <h3 className="lesson-card-title">{l.title}</h3>
                    <div className="lesson-meta-row">
                      <Badge
                        variant={pct === 100 ? 'success' : pct > 0 ? 'der' : 'secondary'}
                        className={`lesson-badge ${pct === 100 ? 'is-complete' : ''}`}
                      >
                        {pct === 100 ? (
                          <>
                            <Check size={11} strokeWidth={3} className="lesson-badge-icon" aria-hidden="true" />
                            <span>Tugallandi</span>
                          </>
                        ) : (
                          `${pct}%`
                        )}
                      </Badge>
                      <span className="lesson-subtext">
                        {pct === 100
                          ? `${l.entries.length} ta so‘z to‘liq yodlandi`
                          : `${l.entries.length} ta so‘z · ${learned} tasi yodlangan`}
                      </span>
                    </div>
                    <div className="lesson-mini-progress" aria-hidden="true">
                      <div
                        className={`lesson-mini-bar ${pct === 100 ? 'is-complete' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight aria-hidden="true" className="lesson-chevron" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
