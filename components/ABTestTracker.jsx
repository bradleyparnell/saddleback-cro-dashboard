import { abTests } from '../data/sprints';

const STATUS_CONFIG = {
  running: { label: '● Running', color: '#2D6A4F', bg: '#D1FAE5' },
  planned: { label: '○ Planned', color: '#7A5C3A', bg: 'var(--tan-light)' },
  complete: { label: '✓ Complete', color: '#1E40AF', bg: '#DBEAFE' },
  paused:  { label: '⏸ Paused', color: '#6B7280', bg: '#F3F4F6' },
};

export default function ABTestTracker() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {abTests.map(test => {
        const sc = STATUS_CONFIG[test.status] || STATUS_CONFIG.planned;
        const hasResults = test.controlCVR !== null && test.variantCVR !== null;
        const lift = hasResults
          ? (((test.variantCVR - test.controlCVR) / test.controlCVR) * 100).toFixed(1)
          : null;

        return (
          <div key={test.id} style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 1px 4px rgba(44,24,16,0.07)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{test.name}</div>
                <div style={{ fontSize: 12, fontFamily: 'sans-serif', color: 'var(--text-light)' }}>
                  Metric: <strong>{test.metric}</strong>
                  {test.startDate && ` · Started ${test.startDate}`}
                </div>
              </div>
              <span style={{
                fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700,
                color: sc.color, background: sc.bg,
                padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap',
              }}>
                {sc.label}
              </span>
            </div>

            {/* Hypothesis */}
            <div style={{ fontSize: 13, fontFamily: 'sans-serif', color: 'var(--text-mid)', marginBottom: 16, fontStyle: 'italic', lineHeight: 1.5 }}>
              💡 {test.hypothesis}
            </div>

            {/* Variants */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { config: test.control, cvr: test.controlCVR, isWinner: hasResults && test.controlCVR > test.variantCVR },
                { config: test.variant, cvr: test.variantCVR, isWinner: hasResults && test.variantCVR > test.controlCVR },
              ].map(({ config, cvr, isWinner }) => (
                <div key={config.label} style={{
                  background: isWinner ? 'var(--cream)' : 'var(--cream-light)',
                  border: `1.5px solid ${isWinner ? 'var(--tan)' : 'var(--border)'}`,
                  borderRadius: 8,
                  padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: 4 }}>
                    {config.label} {isWinner && '🏆'}
                  </div>
                  <div style={{ fontSize: 13, fontFamily: 'sans-serif', color: 'var(--text-mid)', lineHeight: 1.4, marginBottom: 8 }}>
                    {config.description}
                  </div>
                  {cvr !== null ? (
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--leather-dark)' }}>{cvr}%</div>
                  ) : (
                    <div style={{ fontSize: 12, fontFamily: 'sans-serif', color: 'var(--border)', fontStyle: 'italic' }}>Awaiting data</div>
                  )}
                </div>
              ))}
            </div>

            {/* Results summary */}
            {hasResults && (
              <div style={{
                marginTop: 12, padding: '10px 14px',
                background: parseFloat(lift) > 0 ? '#D1FAE5' : '#FEE2E2',
                borderRadius: 8,
                fontSize: 13, fontFamily: 'sans-serif', fontWeight: 600,
                color: parseFloat(lift) > 0 ? 'var(--success)' : 'var(--danger)',
              }}>
                {parseFloat(lift) > 0 ? '▲' : '▼'} {Math.abs(lift)}% lift · Confidence: {test.confidence ?? 'N/A'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
