export function OverviewSkeleton() {
  return (
    <div className="skeleton-flow sk-pulse" aria-hidden="true">
      {/* 1. Overview Hero Card */}
      <div className="overview-hero-card sk-card-surface" style={{ cursor: 'default' }}>
        <div className="hero-card-body">
          <div className="hero-card-eyebrow">
            <div className="sk-bar-strong" style={{ width: 105, height: 14, borderRadius: 4 }} />
            <div className="sk-bar-med" style={{ width: 38, height: 16, borderRadius: 6 }} />
          </div>
          <div className="sk-bar-strong" style={{ width: 220, maxWidth: '85%', height: 28, borderRadius: 8, margin: '4px 0 8px' }} />
          <div className="sk-bar-med" style={{ width: 340, maxWidth: '95%', height: 16, borderRadius: 6, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="sk-bar-light" style={{ width: 70, height: 13, borderRadius: 4 }} />
            <div className="sk-bar-light" style={{ width: 4, height: 4, borderRadius: '50%' }} />
            <div className="sk-bar-light" style={{ width: 60, height: 13, borderRadius: 4 }} />
            <div className="sk-bar-light" style={{ width: 4, height: 4, borderRadius: '50%' }} />
            <div className="sk-bar-light" style={{ width: 80, height: 13, borderRadius: 4 }} />
          </div>
        </div>
        <div className="hero-card-art">
          <div
            style={{
              width: 95,
              height: 85,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)',
              border: '2px solid #bfdbfe',
              opacity: 0.85,
            }}
          />
        </div>
      </div>

      {/* 2. Stats Grid (3 columns) */}
      <div className="stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-item sk-card-surface" style={{ minHeight: 94 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#dbeafe',
                border: '3px solid #bfdbfe',
                flexShrink: 0,
              }}
            />
            <div className="stat-info" style={{ gap: 6 }}>
              <div className="sk-bar-light" style={{ width: 68, height: 12, borderRadius: 4 }} />
              <div className="sk-bar-strong" style={{ width: 46, height: 20, borderRadius: 6 }} />
              <div className="sk-bar-light" style={{ width: 58, height: 11, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Resume Hero Banner */}
      <div className="resume-hero-wrap">
        <div
          className="resume-hero-link sk-card-surface"
          style={{
            cursor: 'default',
            pointerEvents: 'none',
          }}
        >
          <div className="resume-hero-content" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="sk-bar-light" style={{ width: 110, height: 24, borderRadius: 12 }} />
            <div className="sk-bar-strong" style={{ width: 280, maxWidth: '85%', height: 24, borderRadius: 6 }} />
            <div className="sk-bar-med" style={{ width: 200, maxWidth: '70%', height: 14, borderRadius: 4 }} />
          </div>
          <div className="resume-arrow-box" style={{ opacity: 0.8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#bfdbfe' }} />
          </div>
        </div>
      </div>

      {/* 4. Curriculum List Header & Cards */}
      <div className="section-gap">
        <div className="section-header">
          <div className="sk-bar-strong" style={{ width: 140, height: 24, borderRadius: 6 }} />
          <div className="sk-bar-light" style={{ width: 90, height: 14, borderRadius: 4 }} />
        </div>
        <div className="lessons-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="lesson-card-item sk-card-surface" style={{ minHeight: 78 }}>
              <div className="lesson-link" style={{ pointerEvents: 'none', cursor: 'default' }}>
                <div
                  className="lesson-icon-box"
                  style={{
                    background: '#dbeafe',
                    borderColor: '#bfdbfe',
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: '#93c5fd' }} />
                </div>
                <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="sk-bar-strong" style={{ width: 160, maxWidth: '80%', height: 18, borderRadius: 6 }} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div className="sk-bar-med" style={{ width: 44, height: 16, borderRadius: 6 }} />
                    <div className="sk-bar-light" style={{ width: 110, height: 12, borderRadius: 4 }} />
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
