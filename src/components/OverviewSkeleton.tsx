import { Skeleton } from '@/components/ui/skeleton';

export function OverviewSkeleton() {
  return (
    <div className="skeleton-flow" aria-hidden="true">
      {/* 1. Overview Hero Card */}
      <div className="overview-hero-card" style={{ background: '#ffffff', cursor: 'default' }}>
        <div className="hero-card-body">
          <div className="hero-card-eyebrow">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-10 rounded-md" />
          </div>
          <div className="hero-card-title" style={{ display: 'flex', alignItems: 'center', margin: '4px 0 8px' }}>
            <Skeleton className="h-6 sm:h-7 w-60 max-w-[85%] rounded-lg" />
          </div>
          <div className="hero-card-desc" style={{ display: 'flex', alignItems: 'center', margin: '4px 0 10px' }}>
            <Skeleton className="h-4 w-96 max-w-[95%] rounded-md" />
          </div>
          <div className="hero-card-meta">
            <Skeleton className="h-3.5 w-16 rounded-md" />
            <span className="hero-meta-dot">·</span>
            <Skeleton className="h-3.5 w-14 rounded-md" />
            <span className="hero-meta-dot">·</span>
            <Skeleton className="h-3.5 w-20 rounded-md" />
          </div>
        </div>
        <div className="hero-card-art">
          <Skeleton className="w-[82px] h-[74px] min-[421px]:w-[95px] min-[421px]:h-[85px] sm:w-[125px] sm:h-[110px] rounded-2xl flex-shrink-0" />
        </div>
      </div>

      {/* 2. Stats Grid (3 columns) */}
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-item" style={{ background: '#ffffff', cursor: 'default' }}>
            <Skeleton className="w-[46px] h-[46px] sm:w-[68px] sm:h-[68px] rounded-full flex-shrink-0" />
            <div className="stat-info" style={{ gap: 6 }}>
              <Skeleton className="h-3 sm:h-3.5 w-14 sm:w-20 rounded-md" />
              <Skeleton className="h-5 sm:h-6 w-10 sm:w-16 rounded-md" />
              <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-24 rounded-md" />
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
            <div className="resume-badge" style={{ background: '#f1f5f9', borderColor: '#e2e8f0', color: 'transparent' }}>
              <Skeleton className="h-3.5 w-24 rounded-md" />
            </div>
            <div className="resume-headline" style={{ margin: '4px 0 0' }}>
              <Skeleton className="h-5 sm:h-6 w-72 max-w-[90%] rounded-md" />
            </div>
            <div className="resume-subtitle" style={{ margin: '2px 0 0' }}>
              <Skeleton className="h-3.5 sm:h-4 w-52 max-w-[75%] rounded-md" />
            </div>
          </div>
          <div className="resume-arrow-box" style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0' }}>
            <Skeleton className="w-5 h-5 rounded-md" />
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
            <div key={i} className="lesson-card-item" style={{ background: '#ffffff' }}>
              <div className="lesson-link" style={{ pointerEvents: 'none', cursor: 'default' }}>
                <Skeleton className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] rounded-2xl flex-shrink-0" />
                <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton className="h-4.5 sm:h-5 w-48 max-w-[80%] rounded-md" />
                  <div className="lesson-meta-row" style={{ margin: 0 }}>
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                  </div>
                </div>
                <Skeleton className="w-5 h-5 rounded-md flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
