import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lesson } from '../data';

export function LessonHeader({ lesson, learned }: { lesson: Lesson; learned: number }) {
  const total = lesson.entries.length;
  const pct = total ? learned / total : 0;
  const location = useLocation();
  const isVocab = location.pathname.endsWith('/vocabulary');
  const isTest = location.pathname.endsWith('/test');

  return (
    <div style={{ marginBottom: 20 }}>
      <nav className="crumbs" aria-label="Sahifa yo‘li">
        <Link to="/">
          <ChevronLeft size={16} aria-hidden="true" />
          <span>{lesson.level}</span>
        </Link>
        <span aria-hidden="true" style={{ color: '#94A3B8' }}>/</span>
        <span aria-current="page">{lesson.title}</span>
      </nav>
      <h1 className="page-title" tabIndex={-1}>
        {lesson.level} · {lesson.title}
      </h1>

      <nav className="ios-segmented-control" aria-label="Bo‘lim">
        <NavLink className={`seg-item${isVocab ? ' is-active' : ''}`} to={`/${lesson.slug}/vocabulary`}>
          {isVocab && (
            <motion.span
              layoutId="activeLessonTab"
              className="seg-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            />
          )}
          <BookOpen size={16} aria-hidden="true" />
          <span>So‘zlar</span>
        </NavLink>
        <NavLink className={`seg-item${isTest ? ' is-active' : ''}`} to={`/${lesson.slug}/test`}>
          {isTest && (
            <motion.span
              layoutId="activeLessonTab"
              className="seg-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            />
          )}
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>Test</span>
        </NavLink>
      </nav>

      <div className="progress">
        <div className="progress-text">
          <span><strong>{learned}</strong> / {total} so‘z yodlandi</span>
          <span>{Math.round(pct * 100)}%</span>
        </div>
        <div className="bar" role="progressbar" aria-label="Yodlangan so‘zlar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={learned}>
          <i style={{ transform: `scaleX(${pct})` }} />
        </div>
      </div>
    </div>
  );
}
