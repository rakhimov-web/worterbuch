import { Skeleton } from '@/components/ui/skeleton';

export function TopbarSkeleton() {
  return (
    <header className="topbar" aria-hidden="true">
      <div className="brand" style={{ pointerEvents: 'none' }}>
        <Skeleton className="h-[42px] w-[42px] rounded-xl flex-shrink-0" />
        <Skeleton className="h-6 w-32 rounded-lg" />
      </div>
      <div
        className="topbar-badge"
        style={{
          pointerEvents: 'none',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderBottomColor: '#cbd5e1',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </header>
  );
}
