const items = [
  ["overview", "Overview"],
  ["services", "Services"],
  ["research", "Research"],
  ["team", "Team"],
  ["achievements", "Achievements"],
  ["chatbot", "Chatbot Knowledge"],
  ["users", "User Management"],
];

export default function Sidebar({ section, onSelect, user, onLogout, open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><img src="/neuraledge-icon.png" alt="NeuralEdge" /></div>
        <div><strong>NeuralEdge</strong><span>Administration</span></div>
      </div>
      <nav>
        <span className="nav-label">Workspace</span>
        {items.map(([id, label]) => {
          if (id === "users" && user.role !== "owner") return null;
          return (
            <button className={section === id ? "active" : ""} type="button" key={id} onClick={() => { onSelect(id); onClose(); }}>
              <span className="nav-dot" />{label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <span className="role-pill">{user.role}</span>
        <strong>{user.email}</strong>
        <button className="text-button" type="button" onClick={onLogout}>Sign out</button>
      </div>
    </aside>
  );
}
