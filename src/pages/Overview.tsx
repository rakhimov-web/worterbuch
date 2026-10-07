import { Link } from 'react-router-dom';
import { ChevronRight, Award, ArrowRight, CheckCircle2, Check, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { levelLabel, lessons } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSyncExternalStore, useState, useEffect } from 'react';
import { progressStore } from '../lib/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Badge } from '@/components/ui/badge';

function LearningIllustration() {
  return (
    <div className="hero-card-art" aria-hidden="true">
      <svg
        width="125"
        height="110"
        viewBox="0 0 120 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-art-svg"
      >
        <defs>
          <filter id="hero-art-shadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodOpacity="0.12" floodColor="#0F172A" />
          </filter>
        </defs>

        {/* Soft organic backdrop shapes */}
        <path
          d="M88 20C110 32 118 62 106 82C94 102 68 104 50 94C32 84 34 58 46 38C58 18 66 8 88 20Z"
          fill="#818CF8"
          fillOpacity="0.25"
        />
        <circle cx="18" cy="82" r="16" fill="#93C5FD" fillOpacity="0.25" />

        {/* Book 1 (Bottom, Blue with orange bookmark ribbon) */}
        <g filter="url(#hero-art-shadow)">
          <path d="M22 75L62 55L102 75L62 95Z" fill="#1E40AF" />
          <path d="M22 75V81L62 101V95Z" fill="#1D4ED8" />
          <path d="M62 95L102 75V81L62 101Z" fill="#2563EB" />
          <path d="M24 73L62 54L100 73L62 92Z" fill="#FFFFFF" />
          <path d="M24 73V77L62 96V92Z" fill="#E2E8F0" />
          <path d="M62 92L100 73V77L62 96Z" fill="#CBD5E1" />
          <path d="M48 84L45 96L50 93L55 96L52 84Z" fill="#F97316" />
        </g>

        {/* Book 2 (Middle, Green) */}
        <g filter="url(#hero-art-shadow)">
          <path d="M28 62L64 45L100 62L64 79Z" fill="#047857" />
          <path d="M28 62V67L64 84V79Z" fill="#059669" />
          <path d="M64 79L100 62V67L64 84Z" fill="#10B981" />
          <path d="M30 60L64 44L98 60L64 76Z" fill="#FFFFFF" />
          <path d="M30 60V64L64 80V76Z" fill="#E2E8F0" />
          <path d="M64 76L98 60V64L64 80Z" fill="#CBD5E1" />
        </g>

        {/* Book 3 (Top, Gold/Yellow) */}
        <g filter="url(#hero-art-shadow)">
          <path d="M34 49L66 34L98 49L66 64Z" fill="#B45309" />
          <path d="M34 49V54L66 69V64Z" fill="#D97706" />
          <path d="M66 64L98 49V54L66 69Z" fill="#F59E0B" />
          <path d="M36 47L66 33L96 47L66 61Z" fill="#FFFBEB" />
          <path d="M36 47V51L66 65V61Z" fill="#FEF3C7" />
          <path d="M66 61L96 47V51L66 65Z" fill="#FDE68A" />
        </g>

        {/* Graduation Cap */}
        <g filter="url(#hero-art-shadow)">
          <path d="M56 34C56 38 66 41 76 41C86 41 96 38 96 34V37C96 41 86 44 76 44C66 44 56 41 56 37Z" fill="#0F172A" />
          <path d="M76 22L102 32L76 42L50 32Z" fill="#1E293B" />
          <path d="M76 22L102 32L76 34L50 32Z" fill="#334155" />
          <ellipse cx="76" cy="32" rx="2.5" ry="1.5" fill="#F59E0B" />
          <path d="M76 32C79 33 86 36 88 43C88 45 86 46 86 47" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="86" cy="47" r="1.5" fill="#F59E0B" />
        </g>

        {/* Sparkles */}
        <path d="M22 36L23.5 31L28.5 29.5L23.5 28L22 23L20.5 28L15.5 29.5L20.5 31Z" fill="#F59E0B" />
        <path d="M104 18L105 15L108 14L105 13L104 10L103 13L100 14L103 15Z" fill="#3B82F6" />
      </svg>
    </div>
  );
}

export function Overview() {
  usePageTitle('Nemis tili lug‘ati · Wörterbuch');
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
    ? 'Kurs to‘liq o‘zlashtirildi!'
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
      {/* Overview Hero Card (Learning banner matching app reference) */}
      <div className="overview-hero-card">
        <div className="hero-card-body">
          <div className="hero-card-eyebrow">
            <span className="hero-course-tag">Nemis tili kursi</span>
            <span className="hero-level-tag">{levelLabel}</span>
          </div>

          <h1 className="hero-card-title" tabIndex={-1}>
            Nemis tili lug‘ati
          </h1>

          <p className="hero-card-desc">
            Darslikdagi so‘zlarni audio talaffuz va testlar bilan oson o‘rganing.
          </p>

          <div className="hero-card-meta">
            <span>{totalWords} ta so‘z</span>
            <span className="hero-meta-dot">·</span>
            <span>{lessons.length} ta dars</span>
            <span className="hero-meta-dot">·</span>
            <span>Audio & Test</span>
          </div>
        </div>

        <LearningIllustration />
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
