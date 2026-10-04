import { useState, useSyncExternalStore } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { getLesson } from '../data';
import { LessonHeader } from '../components/LessonHeader';
import { progressStore } from '../lib/progress';
import { NotFound } from './NotFound';

export interface LessonOutletContext {
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
}

export function LessonLayout() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? getLesson(slug) : undefined;
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getSnapshot);
  const [isQuizActive, setIsQuizActive] = useState(false);

  if (!lesson) {
    return <NotFound />;
  }

  const validIds = new Set(lesson.entries.map((e) => e.id));
  const learnedCount = (state.lessons[lesson.slug]?.learned ?? []).filter((id) => validIds.has(id)).length;

  return (
    <div style={{ width: '100%' }}>
      <LessonHeader lesson={lesson} learned={learnedCount} showProgress={!isQuizActive} />
      <Outlet context={{ isQuizActive, setIsQuizActive } satisfies LessonOutletContext} />
    </div>
  );
}
