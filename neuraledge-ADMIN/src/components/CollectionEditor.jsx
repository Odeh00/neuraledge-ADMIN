import { useMemo, useState } from "react";
import Modal from "./Modal";

function newItem(fields) {
  return fields.reduce((item, field) => {
    if (field.type === "toggle") item[field.key] = true;
    else if (field.type === "number") item[field.key] = 0;
    else if (field.type === "tags") item[field.key] = [];
    else item[field.key] = "";
    return item;
  }, { id: crypto.randomUUID() });
}

export default function CollectionEditor({ title, eyebrow, description, items, fields, readOnly, onSave }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  function updateField(field, value) {
    setEditing((current) => ({
      ...current,
      [field.key]: field.type === "tags"
        ? value.split(",").map((tag) => tag.trim()).filter(Boolean)
        : field.type === "number" ? Number(value) : value,
    }));
  }

  function commit() {
    const exists = items.some((item) => item.id === editing.id);
    const next = exists ? items.map((item) => item.id === editing.id ? editing : item) : [...items, editing];
    onSave(next, `${exists ? "Edited" : "Added"} ${title.toLowerCase()} item: ${editing.title || editing.name}`);
    setEditing(null);
  }

  return (
    <>
      <header className="page-head">
        <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
        {!readOnly && <button className="primary-button" type="button" onClick={() => setEditing(newItem(fields))}>Add new</button>}
      </header>
      <div className="toolbar">
        <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />
        <span>{items.length} total</span>
      </div>
      <div className="record-grid">
        {filtered.map((item) => (
          <article className="record-card" key={item.id}>
            <div className="record-top">
              <span className={`status ${item.active === false ? "inactive" : ""}`}>{item.active === false ? "Inactive" : "Active"}</span>
              {!readOnly && <div className="card-actions">
                <button type="button" onClick={() => setEditing({ ...item })}>Edit</button>
                <button className="danger-link" type="button" onClick={() => setDeleting(item)}>Delete</button>
              </div>}
            </div>
            <h3>{item.title || item.name}</h3>
            <p>{item.description || item.summary || item.bio}</p>
            <div className="meta-row">
              {(item.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
              {item.category && <span>{item.category}</span>}
              {item.accuracy && <span>{item.accuracy}</span>}
              {item.role && <span>{item.role}</span>}
            </div>
          </article>
        ))}
        {!filtered.length && <div className="empty-state">No matching records.</div>}
      </div>
      {editing && (
        <Modal title={items.some((item) => item.id === editing.id) ? `Edit ${title}` : `Add ${title}`} onClose={() => setEditing(null)}
          actions={<><button className="secondary-button" type="button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" type="button" onClick={commit}>Save changes</button></>}>
          <div className="form-grid">
            {fields.map((field) => (
              <label className={field.wide ? "wide" : ""} key={field.key}>
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea rows="5" value={editing[field.key] || ""} onChange={(event) => updateField(field, event.target.value)} />
                ) : field.type === "toggle" ? (
                  <button className={`toggle ${editing[field.key] ? "on" : ""}`} type="button" onClick={() => updateField(field, !editing[field.key])}>
                    <span />{editing[field.key] ? "Active" : "Inactive"}
                  </button>
                ) : (
                  <input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={field.type === "tags" ? (editing[field.key] || []).join(", ") : editing[field.key] || ""}
                    onChange={(event) => updateField(field, event.target.value)} />
                )}
              </label>
            ))}
          </div>
        </Modal>
      )}
      {deleting && (
        <Modal title="Confirm deletion" onClose={() => setDeleting(null)}
          actions={<><button className="secondary-button" type="button" onClick={() => setDeleting(null)}>Cancel</button><button className="danger-button" type="button" onClick={() => { onSave(items.filter((item) => item.id !== deleting.id), `Deleted ${title.toLowerCase()} item: ${deleting.title || deleting.name}`); setDeleting(null); }}>Delete permanently</button></>}>
          <p className="confirm-copy">Delete <strong>{deleting.title || deleting.name}</strong>? This change is saved immediately.</p>
        </Modal>
      )}
    </>
  );
}
