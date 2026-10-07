import { Skeleton } from '@/components/ui/skeleton';

export function LessonHeaderSkeleton() {
  return (
    <div className="lesson-header-wrap" aria-hidden="true">
      <div className="crumbs flex items-center gap-2" style={{ pointerEvents: 'none' }}>
        <Skeleton className="h-4 w-24 rounded-md" />
        <span style={{ color: '#cbd5e1' }}>/</span>
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>

      <Skeleton className="h-8 w-64 max-w-[80%] rounded-lg" style={{ margin: '12px 0 16px' }} />

      <div className="ios-segmented-control" style={{ pointerEvents: 'none', display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>

      <div className="progress" style={{ marginTop: 16 }}>
        <div className="progress-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
        <div className="bar" style={{ marginTop: 8 }}>
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
