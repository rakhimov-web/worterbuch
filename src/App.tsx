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
      {/* Minimalist German Royal Badge Base */}
      <rect x="0" y="3" width="32" height="29" rx="9" fill="#1e40af" />
      <rect x="0" y="0" width="32" height="28" rx="9" fill="#2563eb" />

      {/* German Tri-color Minimalist Micro Accent */}
      <rect x="7" y="5" width="6" height="2.5" rx="1.25" fill="#111827" />
      <rect x="13" y="5" width="6" height="2.5" rx="1.25" fill="#ef4444" />
      <rect x="19" y="5" width="6" height="2.5" rx="1.25" fill="#f59e0b" />

      {/* Open Vocabulary Book / Card Pages (Pure White) */}
      <path
        d="M7 11.5C7 10.4 7.9 9.5 9 9.5H14.5C15.3 9.5 16 10.2 16 11V21.5C16 21.5 13.8 20.5 9.5 20.5C8.1 20.5 7 21.4 7 22.5V11.5Z"
        fill="#ffffff"
      />
      <path
        d="M25 11.5C25 10.4 24.1 9.5 23 9.5H17.5C16.7 9.5 16 10.2 16 11V21.5C16 21.5 18.2 20.5 22.5 20.5C23.9 20.5 25 21.4 25 22.5V11.5Z"
        fill="#f8fafc"
      />

      {/* Clean Minimalist Golden Ribbon Bookmark */}
      <path d="M15 9.5H17V16L16 15L15 16V9.5Z" fill="#f59e0b" />
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
        <div className="topbar-badge" title="Dars darajasi">
          <Flame size={18} color="#f59e0b" aria-hidden="true" />
          <span>A1.1 Kursi</span>
        </div>
      </header>
      <main id="main">
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.15 }}
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
