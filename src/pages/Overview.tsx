import { Link } from 'react-router-dom';
import { ChevronRight, Award, ArrowRight, Lock, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { levelLabel, lessons } from '../data';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSyncExternalStore } from 'react';
import { progressStore } from '../lib/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Overview() {
  usePageTitle(`${levelLabel} darslari · Wörterbuch`);
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);

  // Compute total statistics
  const firstLesson = lessons[0];
  const validIds = new Set(firstLesson.entries.map((e) => e.id));
  const learnedCount = (state.lessons[firstLesson.slug]?.learned ?? []).filter((id) => validIds.has(id)).length;
  const difficultCount = (state.lessons[firstLesson.slug]?.difficult ?? []).filter((id) => validIds.has(id)).length;
  const totalWords = firstLesson.entries.length;
  const progressPct = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const difficultPct = totalWords > 0 ? Math.round((difficultCount / totalWords) * 100) : 0;

  return (
    <>
      {/* Header & Level Info */}
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ color: '#58cc02' }}>
          <span>Nemis tili kursi</span>
          <span>·</span>
          <span>Goethe A1.1</span>
        </p>
        <h1 className="page-title" tabIndex={-1}>
          <span className="chip-lime">{levelLabel}</span> darajasi
        </h1>
        <p className="lede">Darslikdagi so‘zlarni yodlang: talaffuz, audio va test bilan.</p>
      </div>

      {/* Duolingo Chunky Circular Stats Grid */}
      <div className="stats-grid">
        {/* Stat 1: Kurs o'zlashtirilishi */}
        <Card className="p-5 flex flex-row items-center gap-4">
          <CircularProgress
            value={progressPct}
            size={72}
            strokeWidth={7.5}
            color="#58cc02"
            trackColor="#e5e5e5"
          >
            <span style={{ fontSize: 16, fontWeight: 900, color: '#4b4b4b' }}>
              {progressPct}%
            </span>
          </CircularProgress>
          <div className="flex flex-col min-w-0">
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777777' }}>
              O‘zlashtirish
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#4b4b4b', marginTop: 2 }}>
              {learnedCount} / {totalWords}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#afafaf', marginTop: 1 }}>
              so‘z yodlandi
            </span>
          </div>
        </Card>

        {/* Stat 2: Yodlanganlar holati */}
        <Card className="p-5 flex flex-row items-center gap-4">
          <CircularProgress
            value={progressPct}
            size={72}
            strokeWidth={7.5}
            color="#1cb0f6"
            trackColor="#e5e5e5"
          >
            <CheckCircle2 size={26} color="#1cb0f6" />
          </CircularProgress>
          <div className="flex flex-col min-w-0">
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777777' }}>
              Yodlangan
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#4b4b4b', marginTop: 2 }}>
              {learnedCount} ta
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#afafaf', marginTop: 1 }}>
              faol xotirada
            </span>
          </div>
        </Card>

        {/* Stat 3: Qiyin so'zlar */}
        <Card className="p-5 flex flex-row items-center gap-4">
          <CircularProgress
            value={difficultPct}
            size={72}
            strokeWidth={7.5}
            color="#ff9600"
            trackColor="#e5e5e5"
          >
            <Award size={26} color="#ff9600" />
          </CircularProgress>
          <div className="flex flex-col min-w-0">
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777777' }}>
              Qiyin so‘zlar
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#4b4b4b', marginTop: 2 }}>
              {difficultCount} ta
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#afafaf', marginTop: 1 }}>
              takrorlashga
            </span>
          </div>
        </Card>
      </div>

      {/* Duolingo Green Primary Hero Banner */}
      <div style={{ marginTop: 28 }}>
        <Link
          to={`/${firstLesson.slug}/vocabulary`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px',
            background: '#58cc02',
            border: '2px solid #58cc02',
            borderBottom: '5px solid #46a302',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: 20,
            transition: 'background-color 0.15s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant="warning" className="bg-[#ffd900] text-[#7a5200] border-[#d87e00]">
                <Sparkles size={12} className="mr-1 inline" />
                {learnedCount === 0 ? 'Boshlash' : 'Davom ettirish'}
              </Badge>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginTop: 10, color: '#ffffff', letterSpacing: '-0.015em' }}>
              A1.1 Kursi — So‘zlar va mashqlar
            </h2>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#d7ffb8', marginTop: 4 }}>
              {learnedCount > 0
                ? `${learnedCount} ta so‘z yodlandi · yana ${totalWords - learnedCount} ta qoldi`
                : 'Boshlang‘ich 48 ta muhim so‘z va iboralar'}
            </p>
          </div>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowRight size={24} color="#ffffff" aria-hidden="true" />
          </div>
        </Link>
      </div>

      {/* Darslar ro‘yxati (Curriculum List) */}
      <div className="section-gap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4b4b4b' }}>
            Darslar rejasi
          </h2>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#777777' }}>
            1 ta dars mavjud
          </span>
        </div>

        <ul style={{ display: 'grid', gap: 14 }} aria-label={`${levelLabel} darslari`}>
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
                      background: pct === 100 ? '#d7ffb8' : '#ddf4ff',
                      border: `2px solid ${pct === 100 ? '#a5ed6e' : '#84d8ff'}`,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={24} color={pct === 100 ? '#2b7a00' : '#1cb0f6'} aria-hidden="true" />
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
          <li className="lesson-card-item" style={{ opacity: 0.65, background: '#fafafa' }}>
            <div className="lesson-link" style={{ cursor: 'default' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: '#f0f0f0',
                  border: '2px solid #e5e5e5',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={22} color="#afafaf" aria-hidden="true" />
              </div>
              <div className="grow">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ color: '#777777' }}>Lektion 2: Freunde, Kollegen und ich</h3>
                  <Badge variant="secondary">Tez kunda</Badge>
                </div>
                <p className="lede" style={{ marginTop: 4, fontSize: 14 }}>
                  Kasalxona, ish, tanishuv mavzulari
                </p>
              </div>
              <Lock size={20} color="#afafaf" aria-hidden="true" />
            </div>
          </li>
        </ul>
      </div>

      <p className="quiet">Keyingi darslar tayyor bo‘lgach shu yerda paydo bo‘ladi.</p>
    </>
  );
}
