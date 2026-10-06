import { Link } from 'react-router-dom';
import { ChevronRight, Award, ArrowRight, CheckCircle2, Check, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { levelLabel, lessons } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSyncExternalStore, useState, useEffect } from 'react';
import { progressStore } from '../lib/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Badge } from '@/components/ui/badge';

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

  // Compute statistics for active lesson
  const validIds = new Set(activeLesson.entries.map((e) => e.id));
  const learnedCount = (state.lessons[activeLesson.slug]?.learned ?? []).filter((id) => validIds.has(id)).length;
  const difficultCount = (state.lessons[activeLesson.slug]?.difficult ?? []).filter((id) => validIds.has(id)).length;
  const totalWords = activeLesson.entries.length;
  const progressPct = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const difficultPct = totalWords > 0 ? Math.round((difficultCount / totalWords) * 100) : 0;

  // Determine resume state
  const isCompleted = learnedCount === totalWords && totalWords > 0;
  const isStarted = learnedCount > 0 && !isCompleted;

  const resumeBadge = isCompleted ? 'Mustahkamlang 🎉' : isStarted ? 'Davom ettirish' : 'Boshlash';
  const resumeHeadline = isCompleted
    ? `${activeLesson.title} — Bilimingizni mustahkamlang`
    : isStarted
    ? `${activeLesson.title} — O‘rganishda davom eting`
    : `${activeLesson.title} — O‘rganishni boshlang`;
  const resumeSubtitle = isCompleted
    ? 'Barcha so‘zlar yodlangan, testda o‘zingizni sinang!'
    : isStarted
    ? `${learnedCount} ta so‘z yodlandi · yana ${totalWords - learnedCount} ta qoldi`
    : `${totalWords} ta muhim boshlang‘ich so‘z va iboralar`;

  return (
    <>
      {/* Header & Level Info */}
      <div className="overview-header">
        <p className="eyebrow">
          <span>Nemis tili kursi</span>
          <span>·</span>
          <span>Goethe A1.1</span>
        </p>
        <h1 className="page-title" tabIndex={-1}>
          <span className="chip-lime">{levelLabel}</span> darajasi
        </h1>
        <p className="lede">Darslikdagi so‘zlarni yodlang: talaffuz, audio va test bilan.</p>
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
            <span className="stat-sub">faol xotirada</span>
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
