import { Skeleton } from '@/components/ui/skeleton';

export function OverviewSkeleton() {
  return (
    <div className="skeleton-flow" aria-hidden="true">
      {/* 1. Overview Hero Card */}
      <div className="overview-hero-card" style={{ background: '#ffffff', cursor: 'default' }}>
        <div className="hero-card-body">
          <div className="hero-card-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-10 rounded-md" />
          </div>
          <Skeleton className="h-7 w-60 max-w-[85%] rounded-lg" style={{ margin: '4px 0 8px' }} />
          <Skeleton className="h-4 w-96 max-w-[95%] rounded-md" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Skeleton className="h-3.5 w-16 rounded-md" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-3.5 w-14 rounded-md" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-3.5 w-20 rounded-md" />
          </div>
        </div>
        <div className="hero-card-art">
          <Skeleton className="h-[90px] w-[105px] rounded-2xl" style={{ flexShrink: 0 }} />
        </div>
      </div>

      {/* 2. Stats Grid (3 columns) */}
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-item" style={{ minHeight: 94, background: '#ffffff' }}>
            <Skeleton className="h-12 w-12 rounded-full" style={{ flexShrink: 0 }} />
            <div className="stat-info" style={{ gap: 6, flex: 1, minWidth: 0 }}>
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-2.5 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Resume Hero Banner */}
      <div className="resume-hero-wrap">
        <div
          className="resume-hero-link"
          style={{
            background: '#ffffff',
            borderColor: '#e2e8f0',
            borderBottomColor: '#cbd5e1',
            cursor: 'default',
            pointerEvents: 'none',
          }}
        >
          <div className="resume-hero-content" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-72 max-w-[90%] rounded-md" />
            <Skeleton className="h-4 w-52 max-w-[75%] rounded-md" />
          </div>
          <div className="resume-arrow-box">
            <Skeleton className="h-10 w-10 rounded-xl" style={{ flexShrink: 0 }} />
          </div>
        </div>
      </div>

      {/* 4. Curriculum List Header & Cards */}
      <div className="section-gap">
        <div className="section-header">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <div className="lessons-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="lesson-card-item" style={{ minHeight: 78, background: '#ffffff' }}>
              <div className="lesson-link" style={{ pointerEvents: 'none', cursor: 'default' }}>
                <Skeleton className="h-11 w-11 rounded-xl" style={{ flexShrink: 0 }} />
                <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton className="h-5 w-48 max-w-[80%] rounded-md" />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5 rounded-md" style={{ flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
