import { useState } from "react";
import Modal from "../components/Modal";

const blankEntry = () => ({ id: crypto.randomUUID(), keywords: [], reply: "" });

export default function Chatbot({ items, readOnly, onSave }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onSave(next, "Reordered chatbot knowledge entries");
  }

  function commit() {
    const exists = items.some((item) => item.id === editing.id);
    onSave(exists ? items.map((item) => item.id === editing.id ? editing : item) : [...items, editing], `${exists ? "Edited" : "Added"} chatbot knowledge entry`);
    setEditing(null);
  }

  return (
    <>
      <header className="page-head"><div><span className="eyebrow">Conversation engine</span><h1>Chatbot Knowledge</h1><p>Edit trigger phrases, responses, and matching priority. The public API reads these entries live.</p></div>{!readOnly && <button className="primary-button" onClick={() => setEditing(blankEntry())}>Add entry</button>}</header>
      <div className="knowledge-list">
        {items.map((item, index) => <article className="knowledge-card" key={item.id}>
          <div className="knowledge-order"><strong>{String(index + 1).padStart(2, "0")}</strong>{!readOnly && <div><button disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button></div>}</div>
          <div className="knowledge-copy"><div className="meta-row">{item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div><p>{item.reply}</p></div>
          {!readOnly && <div className="card-actions vertical"><button onClick={() => setEditing({ ...item })}>Edit</button><button className="danger-link" onClick={() => setDeleting(item)}>Delete</button></div>}
        </article>)}
      </div>
      {editing && <Modal title="Chatbot entry" onClose={() => setEditing(null)} actions={<><button className="secondary-button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" onClick={commit}>Save entry</button></>}>
        <div className="form-grid"><label className="wide"><span>Trigger keywords (comma separated)</span><input value={editing.keywords.join(", ")} onChange={(event) => setEditing({ ...editing, keywords: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label><label className="wide"><span>Reply text</span><textarea rows="8" value={editing.reply} onChange={(event) => setEditing({ ...editing, reply: event.target.value })} /></label></div>
      </Modal>}
      {deleting && <Modal title="Delete chatbot entry" onClose={() => setDeleting(null)} actions={<><button className="secondary-button" onClick={() => setDeleting(null)}>Cancel</button><button className="danger-button" onClick={() => { onSave(items.filter((item) => item.id !== deleting.id), "Deleted chatbot knowledge entry"); setDeleting(null); }}>Delete permanently</button></>}><p className="confirm-copy">This response will no longer be available to website visitors.</p></Modal>}
    </>
  );
}
