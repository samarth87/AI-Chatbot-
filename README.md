# ✦ AI Info Generator v3.0

A professional full-stack AI chatbot with multi-provider support, voice input, image generation, file analysis, and persistent chat history.

**Backend:** FastAPI (Python) · **Frontend:** React 19 + Vite + Tailwind CSS · **Database:** SQLite · **AI:** Groq & OpenAI

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 Multi-turn Chat | Persistent conversations with full message history |
| 🤖 Multi-provider AI | Groq (GPT-OSS 120B, ultra-fast) + OpenAI (GPT-4o) |
| 🎤 Voice Input | Mic recording → Groq Whisper transcription |
| 🎨 Image Generation | DALL-E 3 text-to-image (OpenAI key required) |
| 📄 File Upload | PDF, DOCX, TXT analysis + Image vision (PNG/JPG/WEBP) |
| 🔐 Authentication | JWT-based auth with PBKDF2-hashed passwords |
| 📚 Chat History | Date-grouped sidebar with search, rename, delete |
| 🌙 Dark Theme | Professional glassmorphic dark UI |
| ⚙️ Response Settings | Explanation level (Beginner→Advanced) + Length (Short→Detailed) |
| 📱 Responsive | Works on mobile, tablet, and desktop |

---

## 🗂 Project Structure

```
AI-Chatbot--main/
├── app.py                      ← Root launcher (python app.py)
├── requirements.txt
├── .env                        ← Your API keys (not in git)
├── .env.example                ← Template for environment variables
├── info_generator.db           ← SQLite database
│
├── backend/
│   ├── uploads/                ← User uploaded files
│   ├── generated_images/       ← DALL-E 3 saved images
│   └── app/
│       ├── main.py             ← FastAPI app entrypoint
│       ├── api/
│       │   ├── auth.py         ← POST /api/auth/signup, login, GET /me
│       │   ├── chats.py        ← GET/POST/PATCH/DELETE /api/chats/*
│       │   ├── images.py       ← POST /api/images/generate
│       │   └── voice.py        ← POST /api/voice/transcribe
│       ├── core/
│       │   ├── config.py       ← All env vars, paths, APP_CONFIG
│       │   └── security.py     ← JWT + PBKDF2 password hashing
│       ├── database/
│       │   └── db.py           ← SQLite CRUD (users, chats, messages, images)
│       ├── schemas/
│       │   ├── auth.py         ← Pydantic request/response models
│       │   ├── chat.py
│       │   └── images.py
│       ├── services/
│       │   ├── ai_service.py   ← AIProvider base + GroqProvider + OpenAIProvider
│       │   ├── document_service.py  ← PDF/DOCX/TXT extraction
│       │   ├── image_service.py     ← DALL-E 3 generation
│       │   └── speech_service.py    ← Groq Whisper transcription
│       └── utils/
│           └── helpers.py      ← Shared utilities
│
└── frontend/
    └── src/
        ├── App.jsx             ← Root component with providers
        ├── services/
        │   └── api.js          ← REST API client (all endpoints)
        ├── context/
        │   ├── AuthContext.jsx ← User auth state
        │   └── ChatContext.jsx ← Conversation state
        ├── hooks/
        │   ├── useVoice.js     ← MediaRecorder + Whisper transcription
        │   └── useToast.js     ← Toast notifications
        ├── pages/
        │   └── ChatPage.jsx    ← Main chat UI page
        └── components/
            ├── Auth/AuthPage.jsx          ← Sign in / Create account
            ├── Chat/ChatInput.jsx         ← Message input + file + voice + image
            ├── Chat/MessageItem.jsx       ← Markdown message with code highlighting
            ├── Chat/EmptyState.jsx        ← Welcome screen with prompt suggestions
            └── Sidebar/Sidebar.jsx        ← Chat list + settings + profile
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** with `.venv` virtual environment
- **Node.js 18+** and npm
- **Groq API key** (free at [console.groq.com](https://console.groq.com))
- **OpenAI API key** (optional — for GPT-4o, DALL-E 3, image generation)

---

### Step 1 — Clone & Environment Setup

```bash
# Copy the environment template
copy .env.example .env
```

Edit `.env` and fill in your keys:

```env
GROQ_API_KEY=gsk_...your_key_here...
OPENAI_API_KEY=sk-...your_key_here...   # optional
JWT_SECRET=any-long-random-string-here
```

---

### Step 2 — Backend Setup (Python)

```powershell
# Create virtual environment (if it doesn't exist)
python -m venv .venv

# Activate it
.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt
```

---

### Step 3 — Frontend Setup (React)

```powershell
cd frontend
npm install
cd ..
```

---

### Step 4 — Start the App

#### Option A — Production mode (single server)

```powershell
# Build the React frontend first
cd frontend
npm run build
cd ..

# Start the backend (serves the built frontend at http://localhost:8000)
python app.py
```

Open **http://localhost:8000** in your browser.

#### Option B — Development mode (hot reload on both ends)

```powershell
# Terminal 1: Start backend
.venv\Scripts\Activate.ps1
uvicorn backend.app.main:app --reload --port 8000

# Terminal 2: Start frontend dev server
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/config` | No | App config, models, defaults |
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT token |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/chats` | ✅ | List all conversations |
| POST | `/api/chats` | ✅ | Create new conversation |
| GET | `/api/chats/{id}` | ✅ | Get conversation + messages |
| PATCH | `/api/chats/{id}` | ✅ | Rename conversation |
| DELETE | `/api/chats/{id}` | ✅ | Delete conversation |
| POST | `/api/chats/{id}/message` | ✅ | Send message + get AI reply |
| POST | `/api/voice/transcribe` | ✅ | Transcribe audio to text |
| POST | `/api/images/generate` | ✅ | Generate image with DALL-E 3 |
| GET | `/api/images/file/{name}` | No | Serve generated image |
| GET | `/api/images/history` | ✅ | User image generation history |

> Interactive API docs available at **http://localhost:8000/api/docs**

---

## 🔑 Authentication

All protected endpoints require a JWT bearer token:

```
Authorization: Bearer <token>
```

Tokens are issued on login/signup and stored in `localStorage`. They expire after **30 days**.

---

## 🛠 Troubleshooting

**Backend won't start — module not found**
```powershell
# Make sure venv is active and run from project root
.venv\Scripts\Activate.ps1
python app.py
```

**Frontend 404 after build**
```powershell
cd frontend; npm run build; cd ..
# The dist/ folder must exist before starting the backend in production mode
```

**"GROQ_API_KEY missing" error**
- Make sure your `.env` file has `GROQ_API_KEY=gsk_...` and is in the project root.

**Voice not working**
- Allow microphone permission in the browser.
- Voice uses the MediaRecorder API (Chrome/Edge/Firefox supported).

**Image generation fails**
- Image generation requires `OPENAI_API_KEY` in `.env`.
- Groq does not support image generation.

---

## 🔒 Security Notes

- Change `JWT_SECRET` to a long random string before deploying.
- In production, restrict `allow_origins` in `backend/app/main.py` CORS config.
- Never commit `.env` to version control.

---

*Built with FastAPI · React · Groq · OpenAI · SQLite*