import { useEffect, useRef } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Overview } from './pages/Overview';
import { Vocabulary } from './pages/Vocabulary';
import { Quiz } from './pages/Quiz';
import { NotFound } from './pages/NotFound';
import { lessons } from './data';

export function Mark() {
  return (
    <svg className="brand-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Duolingo Chunky 3D Sticker Base */}
      <rect x="0" y="3" width="32" height="29" rx="10" fill="#46a302" />
      <rect x="0" y="0" width="32" height="28" rx="10" fill="#58cc02" />

      {/* Umlaut Dots (¨) in Playful Duolingo Gold */}
      <circle cx="11.5" cy="7.5" r="2" fill="#ffd900" stroke="#000437" strokeWidth="0.75" />
      <circle cx="20.5" cy="7.5" r="2" fill="#ffd900" stroke="#000437" strokeWidth="0.75" />

      {/* Storybook Open Pages (Chunky & Friendly) */}
      <path
        d="M6 13C6 11.5 7.5 10.5 9 10.5H14.5C15.3 10.5 16 11.2 16 12V22C16 22 13.5 21 9 21C7.5 21 6 22 6 23V13Z"
        fill="#ffffff"
        stroke="#46a302"
        strokeWidth="1.2"
      />
      <path
        d="M26 13C26 11.5 24.5 10.5 23 10.5H17.5C16.7 10.5 16 11.2 16 12V22C16 22 18.5 21 23 21C24.5 21 26 22 26 23V13Z"
        fill="#ffffff"
        stroke="#46a302"
        strokeWidth="1.2"
      />

      {/* Duolingo Spark Blue Bookmark Ribbon */}
      <path d="M14.5 10.5H17.5V17L16 15.5L14.5 17V10.5Z" fill="#1cb0f6" />
    </svg>
  );
}

export function App() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const first = useRef(true);

  // Move focus to the page heading after navigation for keyboard / screen-reader accessibility
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#main">Asosiy qismga o‘tish</a>
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Bosh sahifa: Nemis tili lug‘ati">
          <Mark />
          <div className="brand-text">
            <span className="brand-title">Wörterbuch</span>
            <span className="brand-subtitle">Nemis tili</span>
          </div>
        </Link>
        <div className="topbar-badge" title="Kunlik o‘rganish holati">
          <Flame size={18} color="#ff9600" aria-hidden="true" />
          <span>A1.1 Lektion 1</span>
        </div>
      </header>
      <main id="main">
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            {lessons.map((l) => (
              <Route key={l.slug} path={`/${l.slug}`} element={<Navigate to={`/${l.slug}/vocabulary`} replace />} />
            ))}
            <Route path="/:slug/vocabulary" element={<Vocabulary />} />
            <Route path="/:slug/test" element={<Quiz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  );
}
