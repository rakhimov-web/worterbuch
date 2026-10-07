import { Skeleton } from '@/components/ui/skeleton';

export function TopbarSkeleton() {
  return (
    <header className="topbar" aria-hidden="true">
      <div className="brand" style={{ pointerEvents: 'none', cursor: 'default' }}>
        <Skeleton className="w-9 h-9 sm:w-[42px] sm:h-[42px] rounded-xl flex-shrink-0" />
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 rounded-lg" />
      </div>
      <div
        className="topbar-badge"
        style={{
          pointerEvents: 'none',
          cursor: 'default',
        }}
      >
        <Skeleton className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex-shrink-0" />
        <Skeleton className="h-3.5 sm:h-4 w-14 sm:w-16 rounded-md" />
      </div>
    </header>
  );
}
