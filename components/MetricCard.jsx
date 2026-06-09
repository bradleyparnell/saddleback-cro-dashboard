export default function MetricCard({ label, value, sub, delta, deltaPositive, highlight, icon }) {
  return (
    <div style={{
      background: highlight ? 'var(--leather-dark)' : 'white',
      color: highlight ? 'white' : 'var(--text-dark)',
      border: `1px solid ${highlight ? 'var(--leather-dark)' : 'var(--border)'}`,
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      boxShadow: '0 2px 8px rgba(44,24,16,0.07)',
      transition: 'transform 0.15s',
    }}>
      <div style={{ fontSize: 12, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1, color: highlight ? 'var(--tan-light)' : 'var(--leather-dark)' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, fontFamily: 'sans-serif', opacity: 0.65 }}>{sub}</div>
      )}
      {delta && (
        <div style={{
          fontSize: 12,
          fontFamily: 'sans-serif',
          fontWeight: 600,
          color: deltaPositive
            ? (highlight ? '#6EE7A0' : 'var(--success)')
            : (highlight ? '#FCA5A5' : 'var(--danger)'),
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          marginTop: 2,
        }}>
          {deltaPositive ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}
