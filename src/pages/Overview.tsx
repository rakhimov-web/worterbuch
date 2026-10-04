import { Link } from 'react-router-dom';
import { ChevronRight, Award, ArrowRight, Lock, CheckCircle2, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { levelLabel, lessons } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSyncExternalStore } from 'react';
import { progressStore } from '../lib/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Badge } from '@/components/ui/badge';

export function Overview() {
  usePageTitle(`${levelLabel} darslari · Wörterbuch`);
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);

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
      <div style={{ marginBottom: 24, width: '100%' }}>
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
            size={68}
            strokeWidth={7}
            color="#2563eb"
            trackColor="#e2e8f0"
          >
            <TrendingUp size={26} color="#2563eb" />
          </CircularProgress>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.053em', color: '#64748b' }}>
              O‘zlashtirish
            </span>
            <span style={{ fontSize: 21, fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
              {progressPct}%
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginTop: 1 }}>
              {learnedCount} / {totalWords} so‘z
            </span>
          </div>
        </div>

        {/* Stat 2: Yodlanganlar */}
        <div className="stat-item">
          <CircularProgress
            value={progressPct}
            size={68}
            strokeWidth={7}
            color="#10b981"
            trackColor="#e2e8f0"
          >
            <CheckCircle2 size={26} color="#10b981" />
          </CircularProgress>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.053em', color: '#64748b' }}>
              Yodlangan
            </span>
            <span style={{ fontSize: 21, fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
              {learnedCount} ta
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginTop: 1 }}>
              faol xotirada
            </span>
          </div>
        </div>

        {/* Stat 3: Qiyin so'zlar */}
        <div className="stat-item">
          <CircularProgress
            value={difficultPct}
            size={68}
            strokeWidth={7}
            color="#f59e0b"
            trackColor="#e2e8f0"
          >
            <Award size={26} color="#f59e0b" />
          </CircularProgress>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.053em', color: '#64748b' }}>
              Qiyin so‘zlar
            </span>
            <span style={{ fontSize: 21, fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
              {difficultCount} ta
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginTop: 1 }}>
              takrorlashga
            </span>
          </div>
        </div>
      </div>

      {/* Quick Resume Hero Banner (100% Width & Vertically Centered Arrow) */}
      <div style={{ marginTop: 24, width: '100%' }}>
        <Link
          to={`/${activeLesson.slug}/vocabulary`}
          aria-label="Davom ettirish"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            border: '2px solid #1d4ed8',
            borderBottom: '5px solid #1e40af',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: 20,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.22)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.02em',
                width: 'fit-content',
              }}
            >
              <Sparkles size={15} color="#ffffff" aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>{resumeBadge}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 8, color: '#ffffff', letterSpacing: '-0.015em' }}>
              {resumeHeadline}
            </h2>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#bfdbfe', marginTop: 4 }}>
              {resumeSubtitle}
            </p>
          </div>

          {/* Centered Large Arrow Icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              alignSelf: 'center',
              margin: 'auto 0',
            }}
          >
            <ArrowRight size={26} color="#ffffff" aria-hidden="true" />
          </div>
        </Link>
      </div>

      {/* Darslar ro‘yxati (Curriculum List - 100% Width) */}
      <div className="section-gap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, width: '100%' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-dark-heading)' }}>
            Darslar rejasi
          </h2>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>
            1 ta dars mavjud
          </span>
        </div>

        <ul style={{ display: 'grid', gap: 14, width: '100%' }} aria-label={`${levelLabel} darslari`}>
          {lessons.map((l) => {
            const valid = new Set(l.entries.map((e) => e.id));
            const learned = (state.lessons[l.slug]?.learned ?? []).filter((id) => valid.has(id)).length;
            const pct = l.entries.length ? Math.round((learned / l.entries.length) * 100) : 0;

            return (
              <li key={l.slug} className="lesson-card-item">
                <Link className="lesson-link" to={`/${l.slug}/vocabulary`}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: pct === 100 ? '#ecfdf5' : '#eff6ff',
                      border: `2px solid ${pct === 100 ? '#a7f3d0' : '#bfdbfe'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={24} color={pct === 100 ? '#059669' : '#2563eb'} aria-hidden="true" />
                  </div>
                  <div className="grow">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3>{l.title}</h3>
                      <Badge variant={pct === 100 ? 'success' : 'der'}>
                        {pct === 100 ? 'Tugallangan 🎉' : `${pct}%`}
                      </Badge>
                    </div>
                    <p className="lede" style={{ marginTop: 4, fontSize: 15 }}>
                      {l.entries.length} ta so‘z · {learned} tasi yodlangan
                    </p>
                  </div>
                  <ChevronRight aria-hidden="true" />
                </Link>
              </li>
            );
          })}

          {/* Upcoming lesson */}
          <li className="lesson-card-item" style={{ opacity: 0.65, background: '#f8fafc' }}>
            <div className="lesson-link" style={{ cursor: 'default' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: '#f1f5f9',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={22} color="#94a3b8" aria-hidden="true" />
              </div>
              <div className="grow">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ color: '#64748b' }}>Lektion 2: Freunde, Kollegen und ich</h3>
                  <Badge variant="secondary">Tez kunda</Badge>
                </div>
                <p className="lede" style={{ marginTop: 4, fontSize: 14 }}>
                  Kasalxona, ish, tanishuv mavzulari
                </p>
              </div>
              <Lock size={20} color="#94a3b8" aria-hidden="true" />
            </div>
          </li>
        </ul>
      </div>

      <p className="quiet">Keyingi darslar tayyor bo‘lgach shu yerda paydo bo‘ladi.</p>
    </>
  );
}
