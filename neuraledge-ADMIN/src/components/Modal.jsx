export default function Modal({ title, children, onClose, actions }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">NeuralEdge Admin</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </section>
    </div>
  );
}
