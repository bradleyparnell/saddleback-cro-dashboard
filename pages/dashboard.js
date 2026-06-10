import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { sprints, abTests, cvrHistory, BASELINE_CVR, TARGET_CVR, AOV, MONTHLY_SESSIONS, PROJECT_START } from '../data/sprints';

const BROWN = '#2c1810';
const GOLD = '#c9a96e';
const GOLD_DARK = '#a07840';
const CREAM = '#f5ecd7';
const CREAM_DIM = 'rgba(245,236,215,0.6)';
const SURFACE = 'rgba(255,255,255,0.05)';
const BORDER = 'rgba(201,169,110,0.2)';

const statusColors = {
  todo: { bg: 'rgba(201,169,110,0.15)', text: GOLD, label: 'To Do' },
  'in-progress': { bg: 'rgba(100,180,255,0.15)', text: '#64b4ff', label: 'In Progress' },
  done: { bg: 'rgba(100,220,130,0.15)', text: '#64dc82', label: 'Done' },
  planned: { bg: 'rgba(201,169,110,0.1)', text: GOLD, label: 'Planned' },
  running: { bg: 'rgba(100,180,255,0.15)', text: '#64b4ff', label: 'Running' },
  complete: { bg: 'rgba(100,220,130,0.15)', text: '#64dc82', label: 'Complete' },
};

const priorityColors = {
  HIGH: '#e57373',
  MEDIUM: GOLD,
  LOW: 'rgba(245,236,215,0.4)',
};

function Tag({ status }) {
  const s = statusColors[status] || statusColors.todo;
  return (
    <span style={{
      background: s.bg, color: s.text,
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

function MetricCard({ label, value, sub, highlight, delta }) {
  return (
    <div style={{
      background: highlight ? `linear-gradient(135deg, rgba(201,169,110,0.15), rgba(160,120,64,0.1))` : SURFACE,
      border: `1px solid ${highlight ? 'rgba(201,169,110,0.4)' : BORDER}`,
      borderRadius: '14px', padding: '20px 24px',
    }}>
      <p style={{ color: CREAM_DIM, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px' }}>{label}</p>
      <p style={{ color: highlight ? GOLD : CREAM, fontSize: '32px', fontWeight: 700, margin: '0 0 4px', fontFamily: "'Playfair Display', serif" }}>{value}</p>
      {sub && <p style={{ color: CREAM_DIM, fontSize: '13px', margin: 0 }}>{sub}</p>}
      {delta && <p style={{ color: delta.startsWith('+') ? '#64dc82' : '#e57373', fontSize: '13px', margin: '6px 0 0', fontWeight: 600 }}>{delta}</p>}
    </div>
  );
}

function SprintSection({ sprint, updateTask }) {
  const done = sprint.tasks.filter(t => t.status === 'done').length;
  const total = sprint.tasks.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${sprint.status === 'active' ? 'rgba(201,169,110,0.5)' : BORDER}`,
      borderRadius: '14px', padding: '24px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h3 style={{ color: CREAM, margin: 0, fontSize: '17px', fontWeight: 700 }}>{sprint.name}: {sprint.focus}</h3>
            <Tag status={sprint.status === 'active' ? 'in-progress' : 'planned'} />
          </div>
          <p style={{ color: CREAM_DIM, fontSize: '13px', margin: 0 }}>{sprint.dates}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: GOLD, fontSize: '20px', fontWeight: 700, margin: '0 0 2px' }}>{pct}%</p>
          <p style={{ color: CREAM_DIM, fontSize: '12px', margin: 0 }}>{done}/{total} tasks done</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px', marginBottom: '20px' }}>
        <div style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD})`, borderRadius: '4px', height: '100%', width: `${pct}%`, transition: 'width 0.5s ease' }} />
      </div>

      {/* Tasks */}
      {sprint.tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: sprint.status === 'active' ? 'pointer' : 'default',
        }}
          onClick={() => sprint.status === 'active' && updateTask(sprint.id, task.id)}
        >
          {/* Checkbox */}
          <div style={{
            width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
            border: task.status === 'done' ? 'none' : `2px solid ${task.status === 'in-progress' ? '#64b4ff' : 'rgba(201,169,110,0.4)'}`,
            background: task.status === 'done' ? '#64dc82' : task.status === 'in-progress' ? 'rgba(100,180,255,0.2)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
          }}>
            {task.status === 'done' && '✓'}
            {task.status === 'in-progress' && '●'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              color: task.status === 'done' ? 'rgba(245,236,215,0.35)' : CREAM,
              fontSize: '14px', margin: '0 0 2px',
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
            }}>{task.title}</p>
            <p style={{ color: task.status === 'done' ? 'rgba(201,169,110,0.3)' : CREAM_DIM, fontSize: '12px', margin: 0 }}>{task.impact}</p>
          </div>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
            background: priorityColors[task.priority],
          }} title={`${task.priority} priority`} />
        </div>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a0f0a', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '12px 16px' }}>
        <p style={{ color: CREAM_DIM, fontSize: '12px', margin: '0 0 6px' }}>{label}</p>
        <p style={{ color: GOLD, fontSize: '20px', fontWeight: 700, margin: 0 }}>{payload[0].value.toFixed(2)}%</p>
        <p style={{ color: CREAM_DIM, fontSize: '12px', margin: '4px 0 0' }}>CVR</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [taskData, setTaskData] = useState(sprints);
  const [liveData, setLiveData] = useState(null);
  const [convertData, setConvertData] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);

  useEffect(() => {
    // Check auth via sessionStorage
    if (typeof window !== 'undefined') {
      const ok = sessionStorage.getItem('sbl_auth');
      if (!ok) { router.push('/'); return; }
      setAuthed(true);
    }
    // Try to fetch live GA4 data
    fetch('/api/analytics').then(r => r.ok ? r.json() : null).then(d => { if (d) setLiveData(d); }).catch(() => {});
    // Fetch Convert.com experiment data
    setConvertLoading(true);
    fetch('/api/convert').then(r => r.ok ? r.json() : null).then(d => { if (d) setConvertData(d); }).catch(() => {}).finally(() => setConvertLoading(false));
  }, []);

  const updateTask = (sprintId, taskId) => {
    setTaskData(prev => prev.map(s => {
      if (s.id !== sprintId) return s;
      return {
        ...s,
        tasks: s.tasks.map(t => {
          if (t.id !== taskId) return t;
          const next = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'done' : 'todo';
          return { ...t, status: next };
        })
      };
    }));
  };

  const currentCVR = liveData?.cvr || BASELINE_CVR;
  const currentSessions = liveData?.sessions || MONTHLY_SESSIONS;
  const incrementalRevenue = ((currentCVR / 100) * currentSessions * AOV) - (BASELINE_CVR / 100 * MONTHLY_SESSIONS * AOV);
  const cvrLift = currentCVR - BASELINE_CVR;
  const pctToGoal = Math.min(100, ((currentCVR - BASELINE_CVR) / (TARGET_CVR - BASELINE_CVR)) * 100);

  const chartData = [...cvrHistory, ...(liveData?.chartData || [])];

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'sprints', label: '🏃 Sprints' },
    { id: 'abtests', label: '🧪 A/B Tests' },
    { id: 'revenue', label: '💰 Revenue' },
  ];

  if (!authed) return null;

  return (
    <>
      <Head>
        <title>SBL CRO Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a0f0a 0%, #2c1810 100%)', fontFamily: "'Inter', sans-serif", color: CREAM }}>

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(26,15,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛠</div>
            <div>
              <p style={{ color: CREAM, fontSize: '15px', fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', serif" }}>Saddleback Leather</p>
              <p style={{ color: GOLD, fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>CRO Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: liveData ? '#64dc82' : '#c9a96e', borderRadius: '50%' }} />
            <span style={{ color: CREAM_DIM, fontSize: '12px' }}>{liveData ? 'Live' : 'Baseline data'}</span>
          </div>
        </div>

        {/* Progress bar toward goal */}
        <div style={{ padding: '16px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: CREAM_DIM, fontSize: '12px' }}>Baseline: {BASELINE_CVR}%</span>
            <span style={{ color: GOLD, fontSize: '12px', fontWeight: 600 }}>Goal: {TARGET_CVR}% — {pctToGoal.toFixed(0)}% there</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '8px' }}>
            <div style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD})`, borderRadius: '6px', height: '100%', width: `${pctToGoal}%`, transition: 'width 1s ease' }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '20px 24px 0', maxWidth: '900px', margin: '0 auto', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: activeTab === tab.id ? `linear-gradient(135deg, rgba(201,169,110,0.25), rgba(160,120,64,0.15))` : 'transparent',
              border: `1px solid ${activeTab === tab.id ? 'rgba(201,169,110,0.5)' : 'transparent'}`,
              color: activeTab === tab.id ? GOLD : CREAM_DIM,
              padding: '9px 16px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400,
              whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif",
              transition: 'all 0.15s',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px 60px', maxWidth: '900px', margin: '0 auto' }}>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              {/* KPI grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                <MetricCard
                  label="Current CVR"
                  value={`${currentCVR.toFixed(2)}%`}
                  sub={`Baseline: ${BASELINE_CVR}%`}
                  delta={cvrLift !== 0 ? `${cvrLift > 0 ? '+' : ''}${cvrLift.toFixed(2)}% lift` : null}
                  highlight
                />
                <MetricCard
                  label="Target CVR"
                  value={`${TARGET_CVR}%`}
                  sub="90-day goal"
                />
                <MetricCard
                  label="Monthly Sessions"
                  value={currentSessions.toLocaleString()}
                  sub="Organic traffic"
                />
                <MetricCard
                  label="Avg Order Value"
                  value={`$${AOV}`}
                  sub="Current AOV"
                />
              </div>

              {/* CVR Chart */}
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
                <p style={{ color: CREAM_DIM, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px' }}>Conversion Rate Trend</p>
                <p style={{ color: CREAM, fontSize: '18px', fontWeight: 700, margin: '0 0 20px', fontFamily: "'Playfair Display', serif" }}>CVR — Last 12 Months</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="cvrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(245,236,215,0.3)" fontSize={11} tick={{ fill: 'rgba(245,236,215,0.5)' }} />
                    <YAxis domain={[0.5, 2.5]} stroke="rgba(255,255,255,0.05)" fontSize={11} tick={{ fill: 'rgba(245,236,215,0.5)' }} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={TARGET_CVR} stroke={GOLD} strokeDasharray="5 5" strokeOpacity={0.6} label={{ value: 'Goal 2.0%', fill: GOLD, fontSize: 11, position: 'right' }} />
                    <Area type="monotone" dataKey="cvr" stroke={GOLD} strokeWidth={2.5} fill="url(#cvrGrad)" dot={{ fill: GOLD, r: 3 }} activeDot={{ r: 5, fill: GOLD }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Sprint summary */}
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '24px' }}>
                <p style={{ color: CREAM, fontSize: '16px', fontWeight: 700, margin: '0 0 16px', fontFamily: "'Playfair Display', serif" }}>Sprint Progress</p>
                {taskData.map(sprint => {
                  const done = sprint.tasks.filter(t => t.status === 'done').length;
                  const pct = Math.round((done / sprint.tasks.length) * 100);
                  return (
                    <div key={sprint.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                      <div style={{ minWidth: '70px' }}>
                        <p style={{ color: sprint.status === 'active' ? CREAM : CREAM_DIM, fontSize: '13px', fontWeight: 600, margin: 0 }}>{sprint.name}</p>
                        <Tag status={sprint.status === 'active' ? 'in-progress' : 'planned'} />
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '8px' }}>
                        <div style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD})`, borderRadius: '4px', height: '100%', width: `${pct}%` }} />
                      </div>
                      <span style={{ color: GOLD, fontSize: '13px', fontWeight: 600, minWidth: '30px', textAlign: 'right' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SPRINTS TAB */}
          {activeTab === 'sprints' && (
            <div>
              <p style={{ color: CREAM_DIM, fontSize: '13px', marginBottom: '20px' }}>
                Click any task in the active sprint to cycle its status: To Do → In Progress → Done
              </p>
              {taskData.map(sprint => (
                <SprintSection key={sprint.id} sprint={sprint} updateTask={updateTask} />
              ))}
            </div>
          )}

          {/* A/B TESTS TAB */}
          {activeTab === 'abtests' && (
            <div>
              {/* Live Convert.com experiments */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <p style={{ color: CREAM, fontSize: '16px', fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', serif" }}>Live Experiments</p>
                  <span style={{ background: 'rgba(100,180,255,0.15)', color: '#64b4ff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Convert.com</span>
                  {convertLoading && <span style={{ color: CREAM_DIM, fontSize: '12px' }}>Loading…</span>}
                </div>
                {!convertLoading && convertData?.experiments?.length === 0 && (
                  <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px' }}>🧪</p>
                    <p style={{ color: CREAM, fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>No experiments running yet</p>
                    <p style={{ color: CREAM_DIM, fontSize: '13px', margin: 0 }}>Once you launch your first A/B test in Convert.com, it'll appear here with live results.</p>
                  </div>
                )}
                {convertData?.experiments?.map(exp => {
                  const statusColor = {
                    active: { bg: 'rgba(100,220,130,0.15)', text: '#64dc82', label: '● Active' },
                    paused: { bg: 'rgba(201,169,110,0.15)', text: GOLD, label: '⏸ Paused' },
                    completed: { bg: 'rgba(100,180,255,0.15)', text: '#64b4ff', label: '✓ Complete' },
                    draft: { bg: 'rgba(255,255,255,0.08)', text: CREAM_DIM, label: '○ Draft' },
                  }[exp.status] || { bg: 'rgba(255,255,255,0.08)', text: CREAM_DIM, label: exp.status };
                  return (
                    <div key={exp.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ color: CREAM, fontSize: '15px', fontWeight: 700, margin: 0 }}>{exp.name}</h3>
                        <span style={{ background: statusColor.bg, color: statusColor.text, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{statusColor.label}</span>
                      </div>
                      {exp.report ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                          {exp.report.variations?.map(v => (
                            <div key={v.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px' }}>
                              <p style={{ color: CREAM_DIM, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{v.name}</p>
                              <p style={{ color: GOLD, fontSize: '20px', fontWeight: 700, margin: '0 0 2px', fontFamily: "'Playfair Display', serif" }}>
                                {v.conversion_rate != null ? `${(v.conversion_rate * 100).toFixed(2)}%` : '—'}
                              </p>
                              <p style={{ color: CREAM_DIM, fontSize: '11px', margin: 0 }}>{v.visitors?.toLocaleString() ?? '—'} visitors</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: CREAM_DIM, fontSize: '13px', margin: '8px 0 0' }}>No report data yet — test needs visitors to generate results.</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: '24px', paddingTop: '24px' }}>
                <p style={{ color: CREAM, fontSize: '16px', fontWeight: 700, margin: '0 0 14px', fontFamily: "'Playfair Display', serif" }}>Planned Tests</p>
              </div>

              {abTests.map(test => (
                <div key={test.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ color: CREAM, fontSize: '16px', fontWeight: 700, margin: 0 }}>{test.name}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Tag status={test.status} />
                      <span style={{ color: CREAM_DIM, fontSize: '12px' }}>Sprint {test.sprint}</span>
                    </div>
                  </div>
                  <p style={{ color: CREAM_DIM, fontSize: '13px', margin: '0 0 20px', lineHeight: 1.6 }}><strong style={{ color: GOLD }}>Hypothesis:</strong> {test.hypothesis}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Control', data: test.control, color: 'rgba(245,236,215,0.7)' },
                      { label: 'Variant', data: test.variant, color: GOLD },
                    ].map(({ label, data, color }) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '10px', padding: '16px' }}>
                        <p style={{ color: CREAM_DIM, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>{label}</p>
                        <p style={{ color: color, fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{data.name}</p>
                        <p style={{ color: data.cvr ? color : 'rgba(245,236,215,0.25)', fontSize: '24px', fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', serif" }}>
                          {data.cvr ? `${data.cvr}%` : '—'}
                        </p>
                        <p style={{ color: 'rgba(245,236,215,0.25)', fontSize: '12px', margin: '4px 0 0' }}>
                          {data.cvr ? 'CVR' : 'Not started'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {test.confidence && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(100,220,130,0.1)', border: '1px solid rgba(100,220,130,0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64dc82', fontSize: '13px', fontWeight: 600 }}>Winner: {test.winner}</span>
                      <span style={{ color: '#64dc82', fontSize: '13px' }}>{test.confidence}% confidence</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* REVENUE TAB */}
          {activeTab === 'revenue' && (
            <div>
              <div style={{ background: `linear-gradient(135deg, rgba(201,169,110,0.15), rgba(160,120,64,0.05))`, border: `1px solid rgba(201,169,110,0.4)`, borderRadius: '14px', padding: '28px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ color: GOLD, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>Incremental Monthly Revenue at Goal</p>
                <p style={{ color: CREAM, fontSize: '48px', fontWeight: 700, margin: '0 0 4px', fontFamily: "'Playfair Display', serif" }}>+$190,750</p>
                <p style={{ color: CREAM_DIM, fontSize: '14px', margin: '0 0 16px' }}>per month at 2.0% CVR vs. current 0.91%</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 20px' }}>
                    <p style={{ color: GOLD, fontSize: '22px', fontWeight: 700, margin: '0 0 2px' }}>$2.29M</p>
                    <p style={{ color: CREAM_DIM, fontSize: '12px', margin: 0 }}>Annualized lift</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 20px' }}>
                    <p style={{ color: GOLD, fontSize: '22px', fontWeight: 700, margin: '0 0 2px' }}>1,808%</p>
                    <p style={{ color: CREAM_DIM, fontSize: '12px', margin: 0 }}>ROI Month 1</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 20px' }}>
                    <p style={{ color: GOLD, fontSize: '22px', fontWeight: 700, margin: '0 0 2px' }}>~16 days</p>
                    <p style={{ color: CREAM_DIM, fontSize: '12px', margin: 0 }}>Breakeven</p>
                  </div>
                </div>
              </div>

              {/* Revenue scenarios */}
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '24px' }}>
                <p style={{ color: CREAM, fontSize: '16px', fontWeight: 700, margin: '0 0 20px', fontFamily: "'Playfair Display', serif" }}>CVR → Revenue Scenarios</p>
                {[
                  { cvr: 0.91, label: 'Baseline (today)', color: CREAM_DIM },
                  { cvr: 1.2, label: 'Sprint 1 target', color: GOLD },
                  { cvr: 1.5, label: 'Sprint 2 target', color: GOLD },
                  { cvr: 2.0, label: '90-day goal', color: '#64dc82' },
                ].map(row => {
                  const rev = (row.cvr / 100) * MONTHLY_SESSIONS * AOV;
                  const lift = rev - ((BASELINE_CVR / 100) * MONTHLY_SESSIONS * AOV);
                  return (
                    <div key={row.cvr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <p style={{ color: row.color, fontSize: '15px', fontWeight: 600, margin: '0 0 2px' }}>{row.cvr}% CVR</p>
                        <p style={{ color: CREAM_DIM, fontSize: '12px', margin: 0 }}>{row.label}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: row.color, fontSize: '17px', fontWeight: 700, margin: '0 0 2px' }}>${rev.toLocaleString()}/mo</p>
                        {lift > 0 && <p style={{ color: '#64dc82', fontSize: '12px', margin: 0 }}>+${lift.toLocaleString()} lift</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
