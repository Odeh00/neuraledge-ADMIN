export default function Dashboard({ content, activity }) {
  const stats = [
    ["Team members", content.team.length],
    ["Research items", content.research.length],
    ["Achievements", content.achievements.length],
    ["Services", content.services.length],
  ];
  return (
    <>
      <header className="page-head"><div><span className="eyebrow">Control center</span><h1>Overview</h1><p>A live view of NeuralEdge content and recent administrative activity.</p></div></header>
      <div className="stats-grid">{stats.map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><div className="stat-rule" /></article>)}</div>
      <section className="panel">
        <div className="panel-head"><div><span className="eyebrow">Audit trail</span><h2>Recent activity</h2></div><span>Last 10 events</span></div>
        <div className="activity-list">
          {activity.map((item, index) => <div className="activity-row" key={`${item.timestamp}-${index}`}><span className="activity-dot" /><div><strong>{item.action}</strong><p>{item.editorEmail}</p></div><time>{new Date(item.timestamp).toLocaleString()}</time></div>)}
          {!activity.length && <div className="empty-state">No administrative changes have been logged yet.</div>}
        </div>
      </section>
    </>
  );
}
