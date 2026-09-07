/**
 * api.js — Centralized REST API client with JWT bearer token handling.
 */

const BASE_URL = "";  // Empty = same origin (works with Vite proxy in dev, FastAPI in prod)

// ─── Token management ─────────────────────────────────────────────────────────

export function getAuthToken() {
  return localStorage.getItem("ai_chatbot_token");
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("ai_chatbot_token", token);
  } else {
    localStorage.removeItem("ai_chatbot_token");
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      detail = json.detail || json.message || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

// ─── API methods ──────────────────────────────────────────────────────────────

export const api = {
  // Config
  getConfig: () => apiFetch("/api/config"),
  getHealth: () => apiFetch("/api/health"),

  // Auth
  signup: (data) => apiFetch("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => apiFetch("/api/auth/me"),

  // Chats
  getChats: () => apiFetch("/api/chats"),
  createChat: (title) => apiFetch("/api/chats", { method: "POST", body: JSON.stringify({ title }) }),
  getChatDetails: (chatId) => apiFetch(`/api/chats/${chatId}`),
  renameChat: (chatId, title) =>
    apiFetch(`/api/chats/${chatId}`, { method: "PATCH", body: JSON.stringify({ title }) }),
  deleteChat: (chatId) => apiFetch(`/api/chats/${chatId}`, { method: "DELETE" }),

  // Messages
  sendMessage: ({ chatId, prompt, model, level, length, files = [] }) => {
    const form = new FormData();
    form.append("prompt", prompt || "");
    form.append("model", model);
    form.append("level", level);
    form.append("length", length);
    files.forEach((f) => form.append("files", f));
    return apiFetch(`/api/chats/${chatId || "new"}/message`, { method: "POST", body: form });
  },

  // Voice transcription
  transcribeAudio: (audioBlob, filename = "recording.webm") => {
    const form = new FormData();
    form.append("audio", audioBlob, filename);
    return apiFetch("/api/voice/transcribe", { method: "POST", body: form });
  },

  // Image generation
  generateImage: (prompt, conversationId = null, style = "vivid", size = "1024x1024") =>
    apiFetch("/api/images/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, conversation_id: conversationId, style, size })
    }),
  getImageHistory: () => apiFetch("/api/images/history"),
};

export default api;

