import { Skeleton } from '@/components/ui/skeleton';
import { LessonHeaderSkeleton } from './LessonHeaderSkeleton';

export function QuizSkeleton() {
  return (
    <div className="skeleton-flow" aria-hidden="true" style={{ width: '100%' }}>
      <LessonHeaderSkeleton />

      {/* Quiz Card Skeleton */}
      <section style={{ marginTop: 24, width: '100%' }}>
        <div
          className="card"
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '2px solid #e2e8f0',
            borderBottom: '4px solid #cbd5e1',
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          {/* Scope selection skeleton */}
          <Skeleton className="h-5 w-32 rounded-md" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-40 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>

          {/* Mode selection skeleton */}
          <Skeleton className="h-5 w-28 rounded-md" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>

          {/* Subtext info */}
          <Skeleton className="h-4 w-72 max-w-[85%] rounded-md" style={{ marginBottom: 20 }} />

          {/* Start button */}
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
