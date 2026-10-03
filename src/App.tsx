import { useEffect, useRef } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Overview } from './pages/Overview';
import { Vocabulary } from './pages/Vocabulary';
import { Quiz } from './pages/Quiz';
import { NotFound } from './pages/NotFound';
import { lessons } from './data';

function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#150f23" />
      <rect x="5" y="7" width="22" height="18" rx="4" fill="#c2ef4e" />
      <path fill="#1f1633" fillRule="evenodd" d="M11 10.5h5a5.5 5.5 0 0 1 0 11h-5zm3 3v5h2a2.5 2.5 0 0 0 0-5z" />
    </svg>
  );
}

export function App() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const first = useRef(true);

  // Move focus to the page heading after navigation so keyboard / screen-reader users land at the top.
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
        <Link to="/" className="brand">
          <Mark />
          <span>Nemis tili lug‘ati</span>
        </Link>
      </header>
      <main id="main">
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
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
