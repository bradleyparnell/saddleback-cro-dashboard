import { useState } from 'react';
import { sprints } from '../data/sprints';

const PRIORITY_COLOR = { HIGH: '#C0392B', MEDIUM: '#E07B39', LOW: '#2D6A4F' };
const STATUS_LABEL   = { backlog: 'Backlog', 'in-progress': 'In Progress', testing: 'Testing', done: 'Done ✓' };
const STATUS_COLOR   = { backlog: 'var(--border)', 'in-progress': 'var(--tan)', testing: '#6B46C1', done: 'var(--success)' };
const TYPE_ICON      = { development: '⚙️', design: '🎨', marketing: '📣' };

function TaskCard({ task }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}`,
        borderRadius: 8,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        boxShadow: open ? '0 4px 12px rgba(44,24,16,0.12)' : '0 1px 3px rgba(44,24,16,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, flex: 1 }}>
          {TYPE_ICON[task.type]} {task.title}
        </div>
        <span style={{
          fontSize: 10, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.05em',
          color: 'white', background: STATUS_COLOR[task.status],
          padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap',
        }}>
          {STATUS_LABEL[task.status]}
        </span>
      </div>
      {open && (
        <div style={{ marginTop: 10, fontSize: 13, fontFamily: 'sans-serif', color: 'var(--text-mid)', lineHeight: 1.5 }}>
          <p>{task.description}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            <span>📈 Est. Lift: <strong>{task.estimatedLift}</strong></span>
            <span>👤 Owner: <strong>{task.owner}</strong></span>
            <span style={{ color: PRIORITY_COLOR[task.priority], fontWeight: 700 }}>{task.priority} priority</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SprintBoard() {
  const [activeSprint, setActiveSprint] = useState(0);
  const sprint = sprints[activeSprint];

  const columns = {
    backlog:     sprint.tasks.filter(t => t.status === 'backlog'),
    'in-progress': sprint.tasks.filter(t => t.status === 'in-progress'),
    testing:     sprint.tasks.filter(t => t.status === 'testing'),
    done:        sprint.tasks.filter(t => t.status === 'done'),
  };

  return (
    <div>
      {/* Sprint Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {sprints.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveSprint(i)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '1.5px solid var(--leather-mid)',
              background: activeSprint === i ? 'var(--leather-dark)' : 'white',
              color: activeSprint === i ? 'white' : 'var(--leather-dark)',
              fontSize: 13,
              fontFamily: 'sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, fontFamily: 'sans-serif', color: 'var(--text-light)', marginBottom: 16 }}>
        📅 {sprint.dateRange}
      </div>

      {/* Kanban Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {Object.entries(columns).map(([status, tasks]) => (
          <div key={status}>
            <div style={{
              fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-light)', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[status], display: 'inline-block' }} />
              {STATUS_LABEL[status]} ({tasks.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.length === 0 ? (
                <div style={{ fontSize: 12, fontFamily: 'sans-serif', color: 'var(--border)', fontStyle: 'italic', padding: '8px 0' }}>Empty</div>
              ) : (
                tasks.map(t => <TaskCard key={t.id} task={t} />)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
