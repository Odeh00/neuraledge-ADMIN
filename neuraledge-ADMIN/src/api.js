const API_BASE = import.meta.env.VITE_API_BASE || "";
const PREVIEW_MODE = import.meta.env.DEV
  && ["localhost", "127.0.0.1"].includes(window.location.hostname)
  && new URLSearchParams(window.location.search).get("preview") === "owner";

const previewData = {
  "/api/content": {
    services: [
      { id: "service-data-engineering", title: "Data Engineering & Pipeline Design", description: "Extract, transform, and unify enterprise data into clean intelligence.", icon: "database", active: true },
      { id: "service-model-development", title: "Custom AI Model Development", description: "Domain-specific models tuned to your data and enterprise standards.", icon: "brain", active: true },
      { id: "service-strategy", title: "AI Strategy & Advisory", description: "Leadership guidance on AI adoption, feasibility, and implementation roadmaps.", icon: "compass", active: true },
    ],
    research: [
      { id: "research-arabic-fake-news", title: "Arabic Fake News Detection", summary: "Proprietary morphological analysis that outperforms generic multilingual models.", accuracy: "99.05%", publicationDate: "2026-01-15", tags: ["Arabic NLP", "Classification"], link: "", active: true },
    ],
    team: [
      { id: "team-mohammad", name: "Mohammad Jamal Odeh", role: "Founder & CEO", bio: "Founder of NeuralEdge and lead AI strategist.", tags: ["Machine Learning", "Arabic NLP", "AI Strategy"], badge: "FOUNDER", displayOrder: 1, active: true },
    ],
    achievements: [
      { id: "achievement-nlp", title: "99.05% Arabic NLP benchmark", description: "Verified Arabic fake news detection benchmark.", date: "2026-01-15", category: "Research", active: true },
      { id: "achievement-pipeline", title: "Reporting latency reduced by 80%+", description: "Enterprise data unification outcome.", date: "2026-03-01", category: "Business", active: true },
    ],
  },
  "/api/admin/chatbot": {
    success: true,
    chatbot: [
      { id: "chat-services", keywords: ["services", "capabilities", "expertise"], reply: "NeuralEdge provides AI strategy, machine learning development, data engineering, and Arabic NLP." },
      { id: "chat-contact", keywords: ["contact", "email", "get in touch"], reply: "Email ceo@neuraledge.online or use the public contact form." },
    ],
  },
  "/api/admin/activity": {
    success: true,
    activity: [
      { timestamp: new Date().toISOString(), editorEmail: "ceo@neuraledge.online", action: "Opened local dashboard preview" },
    ],
  },
  "/api/admin/users": {
    success: true,
    users: [
      { email: "mohammad_o2005@hotmail.com", role: "owner", dateAdded: "2026-06-10T00:00:00.000Z", lastLogin: null },
      { email: "ceo@neuraledge.online", role: "owner", dateAdded: "2026-06-10T00:00:00.000Z", lastLogin: null },
    ],
  },
};

export async function api(path, options = {}) {
  if (PREVIEW_MODE) {
    if (options.method === "POST") return { success: true };
    if (previewData[path]) return structuredClone(previewData[path]);
  }
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
