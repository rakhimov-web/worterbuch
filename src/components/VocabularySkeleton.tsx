import { Skeleton } from '@/components/ui/skeleton';
import { LessonHeaderSkeleton } from './LessonHeaderSkeleton';

export function VocabularySkeleton() {
  return (
    <div className="skeleton-flow" aria-hidden="true" style={{ width: '100%' }}>
      <LessonHeaderSkeleton />

      {/* Search Input Skeleton */}
      <div className="search" style={{ pointerEvents: 'none' }}>
        <Skeleton className="h-[46px] sm:h-[52px] w-full rounded-2xl" />
      </div>

      {/* Filters Bar & View Switcher */}
      <div className="filters-bar" style={{ pointerEvents: 'none' }}>
        <div className="filters">
          <Skeleton className="h-[40px] sm:h-[44px] w-28 rounded-xl sm:rounded-2xl" />
          <Skeleton className="h-[40px] sm:h-[44px] w-32 rounded-xl sm:rounded-2xl" />
          <Skeleton className="h-[40px] sm:h-[44px] w-28 rounded-xl sm:rounded-2xl" />
        </div>
        <Skeleton className="h-[44px] sm:h-[48px] w-36 rounded-xl sm:rounded-2xl" />
      </div>

      {/* Vocabulary Words List */}
      <ul className="words">
        {[1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="word"
            style={{
              background: '#ffffff',
              cursor: 'default',
              pointerEvents: 'none',
            }}
          >
            <div className="word-content">
              <div className="de" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton className="h-6 w-12 rounded-lg" />
                <Skeleton className="h-6 w-36 rounded-md" />
              </div>
              <div className="uz" style={{ margin: '5px 0 0' }}>
                <Skeleton className="h-4.5 w-48 max-w-[80%] rounded-md" />
              </div>
              <div className="pron" style={{ margin: '5px 0 0' }}>
                <Skeleton className="h-3.5 w-24 rounded-md" />
              </div>
              <div className="tags" style={{ margin: '8px 0 0' }}>
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            </div>
            <div className="row-actions">
              <Skeleton className="w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] rounded-xl sm:rounded-2xl" />
              <Skeleton className="w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] rounded-xl sm:rounded-2xl" />
              <Skeleton className="w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] rounded-xl sm:rounded-2xl" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
