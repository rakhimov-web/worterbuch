export function OverviewSkeleton() {
  return (
    <div className="skeleton-flow sk-pulse" aria-hidden="true">
      {/* 1. Overview Hero Card */}
      <div className="overview-hero-card" style={{ cursor: 'default' }}>
        <div className="hero-card-body">
          <div className="hero-card-eyebrow">
            <div style={{ width: 105, height: 14, borderRadius: 4, background: '#bfdbfe' }} />
            <div style={{ width: 38, height: 16, borderRadius: 6, background: '#dbeafe' }} />
          </div>
          <div style={{ width: 220, maxWidth: '85%', height: 28, borderRadius: 8, background: '#cbd5e1', margin: '4px 0 8px' }} />
          <div style={{ width: 340, maxWidth: '95%', height: 16, borderRadius: 6, background: '#e2e8f0', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 70, height: 13, borderRadius: 4, background: '#e2e8f0' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
            <div style={{ width: 60, height: 13, borderRadius: 4, background: '#e2e8f0' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
            <div style={{ width: 80, height: 13, borderRadius: 4, background: '#e2e8f0' }} />
          </div>
        </div>
        <div className="hero-card-art" style={{ opacity: 0.35 }}>
          <div style={{ width: 95, height: 85, borderRadius: 16, background: '#bfdbfe' }} />
        </div>
      </div>

      {/* 2. Stats Grid (3 columns) */}
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-item" style={{ minHeight: 94 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
            <div className="stat-info" style={{ gap: 6 }}>
              <div style={{ width: 68, height: 12, borderRadius: 4, background: '#e2e8f0' }} />
              <div style={{ width: 44, height: 20, borderRadius: 6, background: '#cbd5e1' }} />
              <div style={{ width: 56, height: 11, borderRadius: 4, background: '#f1f5f9' }} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Resume Hero Banner */}
      <div className="resume-hero-wrap">
        <div
          className="resume-hero-link"
          style={{
            cursor: 'default',
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            borderColor: '#60a5fa',
            borderBottomColor: '#2563eb',
          }}
        >
          <div className="resume-hero-content" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 110, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.25)' }} />
            <div style={{ width: 280, maxWidth: '85%', height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.45)' }} />
            <div style={{ width: 200, maxWidth: '70%', height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div className="resume-arrow-box" style={{ opacity: 0.6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>

      {/* 4. Curriculum List Header & Cards */}
      <div className="section-gap">
        <div className="section-header">
          <div style={{ width: 140, height: 24, borderRadius: 6, background: '#cbd5e1' }} />
          <div style={{ width: 90, height: 14, borderRadius: 4, background: '#e2e8f0' }} />
        </div>
        <div className="lessons-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="lesson-card-item" style={{ minHeight: 78 }}>
              <div className="lesson-link" style={{ pointerEvents: 'none', cursor: 'default' }}>
                <div className="lesson-icon-box" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: '#93c5fd' }} />
                </div>
                <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ width: 160, maxWidth: '80%', height: 18, borderRadius: 6, background: '#cbd5e1' }} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 16, borderRadius: 6, background: '#e2e8f0' }} />
                    <div style={{ width: 110, height: 12, borderRadius: 4, background: '#f1f5f9' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
