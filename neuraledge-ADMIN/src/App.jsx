import { useEffect, useState } from "react";
import { api } from "./api";
import AuthGuard from "./components/AuthGuard";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Research from "./pages/Research";
import Team from "./pages/Team";
import Achievements from "./pages/Achievements";
import Chatbot from "./pages/Chatbot";
import Users from "./pages/Users";

const emptyContent = { services: [], research: [], team: [], achievements: [] };
const previewOwner = {
  email: "ceo@neuraledge.online",
  role: "owner",
  dateAdded: "2026-06-10T00:00:00.000Z",
  lastLogin: null,
};

export default function App() {
  const previewMode = import.meta.env.DEV
    && ["localhost", "127.0.0.1"].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get("preview") === "owner";
  const [user, setUser] = useState(previewMode ? previewOwner : null);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState("overview");
  const [content, setContent] = useState(emptyContent);
  const [chatbot, setChatbot] = useState([]);
  const [activity, setActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (previewMode) {
      setChecking(false);
      return;
    }
    api("/api/admin/me").then((result) => setUser(result.user)).catch(() => {}).finally(() => setChecking(false));
  }, [previewMode]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api("/api/content"),
      api("/api/admin/chatbot"),
      api("/api/admin/activity"),
      user.role === "owner" ? api("/api/admin/users") : Promise.resolve({ users: [] }),
    ]).then(([contentResult, chatbotResult, activityResult, usersResult]) => {
      setContent(contentResult);
      setChatbot(chatbotResult.chatbot);
      setActivity(activityResult.activity);
      setUsers(usersResult.users);
    }).catch((error) => setNotice(error.message));
  }, [user]);

  async function saveContent(key, items, action) {
    const next = { ...content, [key]: items };
    try {
      await api("/api/admin/content", { method: "POST", body: JSON.stringify({ content: next, action }) });
      setContent(next);
      await refreshActivity();
      flash("Content saved");
    } catch (error) { flash(error.message); }
  }

  async function saveChatbot(items, action) {
    try {
      await api("/api/admin/chatbot", { method: "POST", body: JSON.stringify({ chatbot: items, action }) });
      setChatbot(items);
      await refreshActivity();
      flash("Chatbot knowledge saved");
    } catch (error) { flash(error.message); }
  }

  async function saveUsers(items, action) {
    try {
      await api("/api/admin/users", { method: "POST", body: JSON.stringify({ users: items, action }) });
      setUsers(items);
      await refreshActivity();
      flash("Employee access updated");
    } catch (error) { flash(error.message); }
  }

  async function refreshActivity() {
    const result = await api("/api/admin/activity");
    setActivity(result.activity);
  }

  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => {});
    setUser(null);
    setEmailForOtp("");
  }

  if (checking) return <div className="loading-screen"><div className="brand-mark">N</div><span>Loading secure workspace</span></div>;
  if (!user) return emailForOtp
    ? <OtpVerify email={emailForOtp} onVerified={setUser} onBack={() => setEmailForOtp("")} />
    : <Login onCodeSent={setEmailForOtp} />;

  const readOnly = user.role === "viewer";
  const pageProps = { readOnly };
  const pages = {
    overview: <Dashboard content={content} activity={activity} />,
    services: <Services {...pageProps} items={content.services} onSave={(items, action) => saveContent("services", items, action)} />,
    research: <Research {...pageProps} items={content.research} onSave={(items, action) => saveContent("research", items, action)} />,
    team: <Team {...pageProps} items={content.team} onSave={(items, action) => saveContent("team", items, action)} />,
    achievements: <Achievements {...pageProps} items={content.achievements} onSave={(items, action) => saveContent("achievements", items, action)} />,
    chatbot: <Chatbot {...pageProps} items={chatbot} onSave={saveChatbot} />,
    users: user.role === "owner" ? <Users users={users} onSave={saveUsers} /> : null,
  };

  return (
    <AuthGuard user={user}>
      <div className="admin-shell">
        <Sidebar section={section} onSelect={setSection} user={user} onLogout={logout} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="admin-main">
          <div className="mobile-bar"><button className="icon-button" onClick={() => setMenuOpen(true)}>☰</button><span className="mobile-brand"><img src="/neuraledge-icon.png" alt="" /><strong>NeuralEdge Admin</strong></span><span className="role-pill">{user.role}</span></div>
          <div className="page-wrap">{pages[section] || pages.overview}</div>
        </main>
        {notice && <div className="toast">{notice}</div>}
      </div>
    </AuthGuard>
  );
}
