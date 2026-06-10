import { useState } from "react";
import { api } from "../api";

export default function OtpVerify({ email, onVerified, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api("/api/admin/otp/verify", { method: "POST", body: JSON.stringify({ email, code }) });
      onVerified(result.user);
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
          <span className="eyebrow">Secure Verification</span>
          <h1>One final step<br />to enter the<br />operations portal.</h1>
          <p>Your verification code protects NeuralEdge content and<br />employee access. It expires automatically after 10 minutes.</p>
        </div>
        <footer>© 2026 NeuralEdge · Amman, Jordan</footer>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">Operations Portal</span>
          <h2>Enter your code</h2>
          <p>We sent a six-digit verification code to <strong>{email}</strong>.</p>
        <form onSubmit={submit}>
          <label><span>Verification code</span><input className="otp-input" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required autoFocus value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full-button" disabled={busy || code.length !== 6}>{busy ? "Verifying..." : "Verify and sign in"}</button>
          <button className="text-button center-button" type="button" onClick={onBack}>Use a different email</button>
        </form>
          <small>Code expires in 10 minutes</small>
        </div>
      </section>
    </main>
  );
}
