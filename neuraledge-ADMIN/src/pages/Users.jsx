import { useState } from "react";
import Modal from "../components/Modal";

const owners = new Set(["mohammad_o2005@hotmail.com", "ceo@neuraledge.online"]);

export default function Users({ users, onSave }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [form, setForm] = useState({ email: "", role: "editor" });

  function addUser(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (users.some((user) => user.email === email)) return;
    onSave([...users, { email, role: form.role, dateAdded: new Date().toISOString(), lastLogin: null }], `Added ${form.role} user: ${email}`);
    setForm({ email: "", role: "editor" });
    setAdding(false);
  }

  function updateRole(event) {
    event.preventDefault();
    onSave(
      users.map((user) => user.email === editing.email ? { ...user, role: editing.role } : user),
      `Changed employee role: ${editing.email} to ${editing.role}`
    );
    setEditing(null);
  }

  return (
    <>
      <header className="page-head user-page-head"><div><span className="eyebrow">Owner access</span><h1>User Management</h1><p>Control employee access and permission levels. Owner accounts are permanent.</p></div><button className="primary-button" onClick={() => setAdding(true)}>Add employee</button></header>
      <div className="role-guide">
        <div><strong>Editor</strong><span>Can add, edit, and delete website content and chatbot entries.</span></div>
        <div><strong>Viewer</strong><span>Can view dashboard content but cannot make changes.</span></div>
        <div><strong>Owner</strong><span>Full access. Reserved for the two permanent owner accounts.</span></div>
      </div>
      <section className="panel table-panel"><div className="user-table">
        <div className="table-row table-head"><span>Email</span><span>Role</span><span>Date added</span><span>Last login</span><span /></div>
        {users.map((user) => <div className="table-row" key={user.email}><strong>{user.email}</strong><span><span className="role-pill">{user.role}</span></span><span>{user.dateAdded ? new Date(user.dateAdded).toLocaleDateString() : "—"}</span><span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</span><span className="user-actions">{!owners.has(user.email) && <><button className="text-button" onClick={() => setEditing({ ...user })}>Edit role</button><button className="danger-link" onClick={() => setRemoving(user)}>Remove</button></>}</span></div>)}
      </div></section>
      {adding && <Modal title="Add employee" onClose={() => setAdding(false)} actions={<><button className="secondary-button" onClick={() => setAdding(false)}>Cancel</button><button className="primary-button" form="add-user-form">Add employee</button></>}>
        <form id="add-user-form" className="form-grid" onSubmit={addUser}><label className="wide"><span>Email address</span><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label className="wide"><span>Permission level</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="editor">Editor — content access</option><option value="viewer">Viewer — read only</option></select></label></form>
      </Modal>}
      {editing && <Modal title="Edit employee role" onClose={() => setEditing(null)} actions={<><button className="secondary-button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" form="edit-user-form">Save role</button></>}>
        <form id="edit-user-form" className="form-grid" onSubmit={updateRole}>
          <label className="wide"><span>Employee email</span><input value={editing.email} disabled /></label>
          <label className="wide"><span>Permission level</span><select value={editing.role} onChange={(event) => setEditing({ ...editing, role: event.target.value })}><option value="editor">Editor — content access</option><option value="viewer">Viewer — read only</option></select></label>
        </form>
      </Modal>}
      {removing && <Modal title="Remove employee" onClose={() => setRemoving(null)} actions={<><button className="secondary-button" onClick={() => setRemoving(null)}>Cancel</button><button className="danger-button" onClick={() => { onSave(users.filter((user) => user.email !== removing.email), `Removed employee: ${removing.email}`); setRemoving(null); }}>Remove access</button></>}><p className="confirm-copy"><strong>{removing.email}</strong> will immediately lose access to the admin portal.</p></Modal>}
    </>
  );
}
