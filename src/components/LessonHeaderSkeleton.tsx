import { Skeleton } from '@/components/ui/skeleton';

export function LessonHeaderSkeleton() {
  return (
    <div className="lesson-header-wrap" aria-hidden="true">
      <div className="crumbs" style={{ pointerEvents: 'none' }}>
        <Skeleton className="h-4 w-28 rounded-md" />
        <span style={{ color: '#cbd5e1' }}>/</span>
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>

      <div className="page-title" style={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton className="h-7 sm:h-9 w-64 max-w-[80%] rounded-lg" />
      </div>

      <div className="ios-segmented-control" style={{ pointerEvents: 'none' }}>
        <div className="seg-item" style={{ justifyContent: 'center' }}>
          <Skeleton className="h-4.5 w-16 rounded-md" />
        </div>
        <div className="seg-item" style={{ justifyContent: 'center' }}>
          <Skeleton className="h-4.5 w-14 rounded-md" />
        </div>
      </div>

      <div className="progress">
        <div className="progress-text">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
        <div className="bar">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
