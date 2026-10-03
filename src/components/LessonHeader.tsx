import { Link, NavLink } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Lesson } from '../data';

export function LessonHeader({ lesson, learned }: { lesson: Lesson; learned: number }) {
  const total = lesson.entries.length;
  const pct = total ? learned / total : 0;
  return (
    <>
      <nav className="crumbs" aria-label="Sahifa yo‘li">
        <Link to="/"><ChevronLeft size={16} aria-hidden="true" />{lesson.level}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{lesson.title}</span>
      </nav>
      <h1 className="page-title" tabIndex={-1}>{lesson.level} · {lesson.title}</h1>
      <nav className="tabs" aria-label="Bo‘lim">
        <NavLink className="tab" to={`/${lesson.slug}/vocabulary`}>So‘zlar</NavLink>
        <NavLink className="tab" to={`/${lesson.slug}/test`}>Test</NavLink>
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
    </>
  );
}
