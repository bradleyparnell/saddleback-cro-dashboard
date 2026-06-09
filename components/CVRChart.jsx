import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--leather-dark)', color: 'white',
      borderRadius: 8, padding: '10px 14px',
      fontSize: 13, fontFamily: 'sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : p.dataKey === 'sessions' ? p.value.toLocaleString() : `${p.value}%`}
        </div>
      ))}
    </div>
  );
};

export default function CVRChart({ data, showRevenue = false }) {
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fontFamily: 'sans-serif', fill: 'var(--text-light)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'sans-serif', fill: 'var(--text-light)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => showRevenue ? `$${(v/1000).toFixed(0)}k` : `${v}%`}
            domain={showRevenue ? ['auto', 'auto'] : [0, 2.5]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0.91} stroke="#C0392B" strokeDasharray="5 5" label={{ value: 'Baseline 0.91%', position: 'insideTopRight', fontSize: 10, fill: '#C0392B', fontFamily: 'sans-serif' }} />
          <ReferenceLine y={2.00} stroke="var(--success)" strokeDasharray="5 5" label={{ value: 'Target 2.00%', position: 'insideTopRight', fontSize: 10, fill: 'var(--success)', fontFamily: 'sans-serif' }} />
          {showRevenue ? (
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--tan)" strokeWidth={2.5} dot={false} />
          ) : (
            <Line type="monotone" dataKey="cvr" name="CVR" stroke="var(--leather-mid)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: 'var(--leather-dark)' }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
