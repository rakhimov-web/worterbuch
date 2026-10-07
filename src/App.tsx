import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Overview } from './pages/Overview';
import { Vocabulary } from './pages/Vocabulary';
import { Quiz } from './pages/Quiz';
import { NotFound } from './pages/NotFound';
import { LessonLayout } from './pages/LessonLayout';
import { OverviewSkeleton } from './components/OverviewSkeleton';
import { lessons, getLesson } from './data';

export function Mark() {
  return (
    <svg className="brand-icon" viewBox="0 0 512 512" fill="none" aria-hidden="true" style={{ fillRule: 'evenodd' }}>
      {/* 3D Sticker Squircle Base */}
      <rect x="0" y="44" width="512" height="468" rx="140" fill="#1d4ed8" />
      <rect x="0" y="0" width="512" height="468" rx="140" fill="#2563eb" />

      {/* User Vector Paths */}
      <path d="M 242.21 342 C 242.17 425.13, 242.14 428.56, 241.55 430.08 C 239.84 434.48, 236.34 434.39, 230.78 429.79 C 223.59 423.83, 214.84 417.64, 208.5 414.01 C 205.73 412.43, 196.37 407.72, 194.33 406.88 L 190.17 405.16 C 182.62 402.05, 169.83 398.4, 161.67 397.04 C 152.09 395.45, 140.91 394.33, 134.54 394.33 C 123.65 394.34, 115.95 392.24, 110.27 387.72 C 104.2 382.9, 100.45 376.93, 98.09 368.33 C 97.53 366.28, 97.5 361.47, 97.5 275.5 C 97.5 184.83, 97.5 184.83, 98.43 182.45 C 100.28 177.73, 102.98 175, 107.5 173.27 C 109.5 172.5, 109.5 172.5, 135.67 172.52 C 158.64 172.54, 162.44 172.61, 166.83 173.14 C 173.47 173.93, 178.62 174.8, 181.85 175.69 L 185.5 176.67 C 192.16 178.39, 202.45 183.01, 208.09 186.81 C 216.69 192.6, 224.06 200.36, 229.55 209.41 C 232.63 214.49, 236.15 222.35, 237.66 227.49 C 239.24 232.89, 240.16 236.86, 240.82 241 C 242.24 249.99, 242.26 251.36, 242.21 342 Z" fill="#ffffff" />
      <path d="M 392.3 105.5 C 392.3 110.27, 392.18 115.14, 392.02 116.33 L 391.35 121.43 C 390.97 124.41, 389.29 133.3, 388.64 135.8 L 387.77 139.17 C 387.02 142.07, 384.51 149.94, 383.01 154.05 C 377.4 169.4, 368.3 185.75, 358.19 198.62 C 354.35 203.52, 344.01 214.01, 340.22 216.86 C 331.87 223.15, 325.51 227.09, 314.5 232.83 C 297.83 241.51, 291.29 246.11, 278.71 257.98 C 271.65 264.63, 264.91 272.54, 260.23 279.64 C 259.1 281.36, 257.91 282.94, 257.59 283.13 C 256.72 283.67, 256.02 282.76, 255.4 280.29 C 254.94 278.43, 254.86 273.57, 254.75 240.83 C 254.65 208.12, 254.7 203.11, 255.16 200.33 C 257.13 188.38, 259.9 177.97, 263.67 168.33 L 264.65 165.67 L 266.66 161 C 274 144.91, 283.81 131.55, 295.43 121.83 C 305.56 113.36, 320.82 104.43, 333.33 99.66 C 339.43 97.34, 341.57 96.6, 344.5 95.82 L 349.67 94.44 C 360.94 91.35, 374.04 89.99, 381.5 91.14 C 385.44 91.75, 387.49 92.37, 389.33 93.52 C 390.6 94.32, 391.81 95.54, 392.1 96.33 C 392.2 96.61, 392.29 100.73, 392.3 105.5 Z" fill="#93c5fd" />
      <path d="M 406.45 308.45 C 406.41 364.8, 406.4 365.54, 405.72 368.5 C 404.14 375.39, 401.83 380.66, 398.2 385.67 C 395.32 389.64, 390.69 393.11, 385.54 395.15 C 381.33 396.81, 378.15 397.44, 366.83 398.84 C 352.6 400.6, 345.42 402.11, 333.67 405.83 C 318.93 410.5, 308.16 415.39, 296.67 422.63 L 293.5 424.54 C 291.37 425.71, 286.36 429.22, 283.38 431.64 C 279.26 434.97, 276.61 436.8, 274.15 438.02 C 267.39 441.38, 262.14 440.34, 259.67 435.18 C 258.65 433.04, 258.65 433.04, 258.76 380.1 C 258.88 323.45, 258.79 326.43, 260.45 319 C 262.48 309.91, 264.47 304.44, 268.93 295.67 C 274.97 283.8, 285.38 271.26, 296.34 262.67 C 305.47 255.51, 307.24 254.37, 317.83 248.83 C 326.12 244.49, 337.19 240.83, 347 239.19 C 352.49 238.27, 357.42 238, 372.5 237.78 C 385.25 237.6, 387.67 237.65, 391 238.14 C 396.72 238.97, 399.25 240.03, 402.3 242.86 C 404.34 244.75, 405.82 247.42, 406.27 250.03 C 406.39 250.78, 406.48 277.07, 406.45 308.45 Z" fill="#ffffff" />
    </svg>
  );
}

function LessonRedirect() {
  const { slug } = useParams();
  const lesson = getLesson(slug);
  return lesson ? <Navigate to={`/${lesson.slug}/vocabulary`} replace /> : <NotFound />;
}

export function App() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const first = useRef(true);

  // Synchronous check: in SSR or JSDOM (tests), fontsReady starts true so tests pass instantly
  const [fontsLoaded, setFontsLoaded] = useState(() => {
    if (typeof document === 'undefined' || !document.fonts || !document.fonts.ready) return true;
    return document.fonts.status === 'loaded';
  });

  useEffect(() => {
    if (fontsLoaded) return;
    let active = true;
    // Safety fallback so content always renders even if font network fails
    const timer = setTimeout(() => {
      if (active) setFontsLoaded(true);
    }, 350);

    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (active) setFontsLoaded(true);
        })
        .catch(() => {
          if (active) setFontsLoaded(true);
        });
    }

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fontsLoaded]);

  // Move focus to the page heading after navigation for keyboard / screen-reader accessibility
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  // Lesson-level key ensures smooth tab switching without remounting the entire view
  const transitionKey = pathname === '/' ? 'home' : pathname.split('/')[1] || 'root';

  return (
    <div className="shell">
      <a className="skip" href="#main">Asosiy qismga o‘tish</a>
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Bosh sahifa: Nemis tili lug‘ati">
          <Mark />
          <span className="brand-title">Wörterbuch</span>
        </Link>
        <div className="topbar-badge" title="Dars darajasi">
          <Flame size={18} color="#f59e0b" aria-hidden="true" />
          <span>Nemis tili</span>
        </div>
      </header>
      <main id="main">
        {!fontsLoaded && pathname === '/' ? (
          <OverviewSkeleton />
        ) : (
          <motion.div
            key={transitionKey}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <Routes>
              <Route path="/" element={<Overview />} />
              {lessons.map((l) => (
                <Route key={l.slug} path={`/${l.slug}`} element={<Navigate to={`/${l.slug}/vocabulary`} replace />} />
              ))}
              <Route path="/:slug" element={<LessonLayout />}>
                <Route path="vocabulary" element={<Vocabulary hideHeader />} />
                <Route path="test" element={<Quiz hideHeader />} />
                <Route index element={<LessonRedirect />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;

