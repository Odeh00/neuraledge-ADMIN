import { useState } from "react";
import { api } from "../api";

export default function Login({ onCodeSent }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api("/api/admin/otp/request", { method: "POST", body: JSON.stringify({ email }) });
      onCodeSent(email.trim().toLowerCase());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <div className="auth-monogram" aria-label="NeuralEdge">
          <strong>NE</strong>
          <span>Neural<br />Edge</span>
          <small>Strategic AI Advisory</small>
        </div>
        <div className="auth-story-copy">
          <span className="eyebrow">Strategic AI Advisory</span>
          <h1>Enterprise AI,<br />built on rigorous<br />science.</h1>
          <p>This portal is for authorized NeuralEdge personnel only.<br />Content changes made here are reflected immediately on<br />the public website.</p>
        </div>
        <footer>© 2026 NeuralEdge · Amman, Jordan</footer>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">Operations Portal</span>
          <h2>Sign in</h2>
          <p>Enter your authorized email address to receive a verification code.</p>
        <form onSubmit={submit}>
            <label><span>Email address</span><input type="email" required autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@neuraledge.online" /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full-button" disabled={busy}>{busy ? "Sending..." : "Send verification code"}</button>
        </form>
          <small>Authorized personnel only</small>
        </div>
      </section>
    </main>
  );
}
