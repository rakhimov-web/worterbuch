import { Skeleton } from '@/components/ui/skeleton';
import { LessonHeaderSkeleton } from './LessonHeaderSkeleton';

export function VocabularySkeleton() {
  return (
    <div className="skeleton-flow" aria-hidden="true" style={{ width: '100%' }}>
      <LessonHeaderSkeleton />

      {/* Search Input Skeleton */}
      <div className="search pointer-events-none" style={{ marginTop: 20 }}>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>

      {/* Filters Bar & View Switcher */}
      <div
        className="filters-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginTop: 16,
          flexWrap: 'wrap',
        }}
      >
        <div className="filters" style={{ display: 'flex', gap: 8 }}>
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Vocabulary Words List */}
      <ul
        className="words"
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          listStyle: 'none',
          padding: 0,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="word"
            style={{
              background: '#ffffff',
              minHeight: 104,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '18px 20px',
              borderRadius: 18,
              border: '2px solid #e2e8f0',
              borderBottom: '4px solid #cbd5e1',
              boxSizing: 'border-box',
            }}
          >
            <div className="word-content" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton className="h-6 w-12 rounded-lg" />
                <Skeleton className="h-6 w-36 rounded-md" />
              </div>
              <Skeleton className="h-4.5 w-48 max-w-[80%] rounded-md" />
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            </div>
            <div className="row-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
