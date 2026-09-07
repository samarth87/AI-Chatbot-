# 🤖 AI Info Generator — Full-Stack AI Chatbot

A professional full-stack AI chatbot application built with **React 19, Vite, Tailwind CSS, FastAPI, SQLite, Groq, and OpenAI**.

The application provides a ChatGPT-style conversational experience with **persistent chat history, multi-provider AI support, voice input, file analysis, image generation, JWT authentication, and a responsive modern UI**.

---

## 🌟 Overview

**AI Info Generator** is an AI-powered conversational platform designed to provide users with a complete chatbot experience rather than a simple API-based chat interface.

Users can:

* 💬 Have multi-turn AI conversations
* 🤖 Use different AI providers
* 🧠 Ask questions and receive AI-generated answers
* 🎤 Speak through a microphone and convert speech into text
* 🖼️ Generate AI images
* 📄 Upload and analyze documents
* 💾 Maintain persistent chat history
* 🔐 Create accounts and securely authenticate
* 📝 Rename conversations
* 🗑️ Delete conversations
* ⚙️ Customize explanation level and response length
* 📱 Use the application on desktop, tablet, and mobile devices

---

# ✨ Features

| Feature                     | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| 💬 **Multi-turn Chat**      | Maintains conversations with complete message history |
| 🤖 **Multi-provider AI**    | Supports Groq and OpenAI                              |
| ⚡ **Groq AI**               | Fast conversational AI responses                      |
| 🧠 **OpenAI**               | Supports OpenAI models such as GPT-4o                 |
| 🎤 **Voice Input**          | Records microphone audio and converts it to text      |
| 🖼️ **AI Image Generation** | Generates images using OpenAI DALL-E                  |
| 📄 **File Analysis**        | Supports PDF, DOCX and TXT document analysis          |
| 👁️ **Image Analysis**      | Supports image-based input such as PNG/JPG/WEBP       |
| 🔐 **JWT Authentication**   | Secure signup/login system                            |
| 🔑 **Password Hashing**     | Passwords are protected using PBKDF2 hashing          |
| 💾 **Persistent History**   | Conversations and messages are stored in SQLite       |
| 📚 **Chat Sidebar**         | Search, rename and delete conversations               |
| 🌙 **Dark UI**              | Modern glassmorphic dark interface                    |
| ⚙️ **Response Settings**    | Beginner → Advanced explanation levels                |
| 📏 **Response Length**      | Short → Detailed response control                     |
| 📱 **Responsive Design**    | Works across desktop, tablet and mobile               |

---

# 🏗️ Technology Stack

## Frontend

* React 19
* Vite
* Tailwind CSS
* JavaScript / JSX
* Context API
* MediaRecorder API

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* PyJWT
* Python-dotenv

## AI

* Groq API
* OpenAI API
* Groq Whisper
* OpenAI GPT models
* DALL-E 3

## Database

* SQLite

## Document Processing

* PyPDF
* python-docx

---

# 🧩 Architecture

The application uses a separated frontend/backend architecture.

```text
                         USER
                           │
                           ↓
                  ┌─────────────────┐
                  │  React 19 UI    │
                  │ Vite + Tailwind │
                  └────────┬────────┘
                           │
                     REST API Calls
                           │
                           ↓
                  ┌─────────────────┐
                  │ FastAPI Backend │
                  └────────┬────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ↓                ↓                ↓
      AI Service       Database        File Services
          │                │                │
     ┌────┴────┐           │          ┌─────┴─────┐
     ↓         ↓            ↓          ↓           ↓
   Groq     OpenAI        SQLite     Documents   Images
     │         │
     │         ├────────→ DALL-E
     │
     └────────→ Whisper
```

---

# 📂 Project Structure

```text
AI-Chatbot--main/
│
├── app.py
├── run.py
├── server.py
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   │
│   ├── __init__.py
│   ├── auth.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── services.py
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   ├── generated_images/
│   │   └── .gitkeep
│   │
│   └── app/
│       │
│       ├── __init__.py
│       ├── main.py
│       │
│       ├── api/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── chats.py
│       │   ├── images.py
│       │   └── voice.py
│       │
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py
│       │   └── security.py
│       │
│       ├── database/
│       │   ├── __init__.py
│       │   └── db.py
│       │
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── chat.py
│       │   └── images.py
│       │
│       ├── services/
│       │   ├── __init__.py
│       │   ├── ai_service.py
│       │   ├── document_service.py
│       │   ├── image_service.py
│       │   └── speech_service.py
│       │
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
│
└── frontend/
    │
    ├── index.html
    ├── package.json
    ├── vite.config.*
    ├── README.md
    ├── .gitignore
    │
    └── src/
        ├── App.jsx
        │
        ├── services/
        │   └── api.js
        │
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ChatContext.jsx
        │
        ├── hooks/
        │   ├── useVoice.js
        │   └── useToast.js
        │
        ├── pages/
        │   └── ChatPage.jsx
        │
        └── components/
            ├── Auth/
            │   └── AuthPage.jsx
            │
            ├── Chat/
            │   ├── ChatInput.jsx
            │   ├── MessageItem.jsx
            │   └── EmptyState.jsx
            │
            └── Sidebar/
                └── Sidebar.jsx
```

---

# 🔄 Application Workflow

The overall application workflow is:

```text
User
 │
 ↓
Sign Up / Login
 │
 ↓
JWT Authentication
 │
 ↓
Chat Dashboard
 │
 ├───────────────┐
 │               │
 ↓               ↓
New Chat       Chat History
 │               │
 ↓               ↓
Send Message   Select Chat
 │
 ↓
FastAPI Backend
 │
 ↓
AI Service
 │
 ├───────────────┐
 ↓               ↓
Groq           OpenAI
 │               │
 └───────┬───────┘
         ↓
    AI Response
         ↓
   Save Message
         ↓
   SQLite Database
         ↓
   React Interface
```

---

# 💬 Chat System

The chatbot supports persistent multi-turn conversations.

When a user sends a message:

```text
User Message
     ↓
React
     ↓
POST /api/chats/{id}/message
     ↓
FastAPI
     ↓
AI Provider
     ↓
Generate Response
     ↓
Save User Message
     ↓
Save AI Response
     ↓
Return Response
     ↓
React Chat UI
```

This allows users to continue conversations instead of starting from zero every time.

---

# 🤖 Multi-Provider AI

The project supports multiple AI providers.

## Groq

Groq is used for fast conversational AI responses.

The backend includes a provider-based architecture that allows AI providers to be handled through a common interface.

```text
AIProvider
   │
   ├── GroqProvider
   │
   └── OpenAIProvider
```

This makes it easier to add additional AI providers in the future.

---

# 🎤 Voice Input

The chatbot includes microphone support.

### Workflow

```text
User clicks microphone
        ↓
Browser requests microphone permission
        ↓
MediaRecorder records audio
        ↓
Audio sent to backend
        ↓
Groq Whisper
        ↓
Speech converted to text
        ↓
Text placed into chat input
        ↓
User sends message
```

The frontend voice functionality is handled through:

```text
frontend/src/hooks/useVoice.js
```

The backend endpoint is:

```http
POST /api/voice/transcribe
```

---

# 🖼️ AI Image Generation

The application supports AI image generation through OpenAI.

### Workflow

```text
User enters image prompt
        ↓
React
        ↓
FastAPI
        ↓
Image Service
        ↓
OpenAI DALL-E
        ↓
Generated Image
        ↓
Saved to generated_images/
        ↓
Image returned to frontend
```

Endpoint:

```http
POST /api/images/generate
```

Generated images can be accessed through:

```http
GET /api/images/file/{name}
```

Image generation requires an OpenAI API key.

---

# 📄 File Analysis

The chatbot can work with uploaded documents.

Supported formats include:

* PDF
* DOCX
* TXT

The document service extracts text from uploaded files so that the AI can use the extracted information when responding.

### Workflow

```text
User uploads document
        ↓
React
        ↓
FastAPI
        ↓
Document Service
        ↓
Text Extraction
        ↓
AI Context
        ↓
AI Response
```

Supported document libraries include:

```text
PyPDF
python-docx
```

---

# 👁️ Image Input

The application also supports image-based input such as:

```text
PNG
JPG
JPEG
WEBP
```

Images can be processed through the AI/vision workflow depending on the configured provider and model.

---

# 🔐 Authentication

Authentication is implemented using JWT.

### Registration

```http
POST /api/auth/signup
```

### Login

```http
POST /api/auth/login
```

### Current User

```http
GET /api/auth/me
```

Protected endpoints use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🔑 Password Security

Passwords are not intended to be stored as plain text.

The security module uses **PBKDF2-based password hashing**.

The authentication flow is:

```text
Password
   ↓
PBKDF2 Hash
   ↓
Database
```

During login:

```text
Entered Password
      ↓
Verify Hash
      ↓
Valid?
 ┌────┴────┐
 ↓         ↓
YES        NO
 ↓         ↓
JWT       Reject
```

---

# 💾 Database

The application uses **SQLite** for local development and persistence.

The database stores information such as:

* Users
* Conversations
* Messages
* Generated images

The database functionality is handled by:

```text
backend/app/database/db.py
```

A typical relationship is:

```text
USER
 │
 └──→ CHATS
        │
        └──→ MESSAGES
```

Generated image history is also associated with users.

---

# 📚 Chat History

Users can manage previous conversations through the sidebar.

Supported operations include:

* View chats
* Search chats
* Create chats
* Rename chats
* Delete chats
* Open previous conversations

Typical workflow:

```text
User
 ↓
Sidebar
 ↓
Chat History
 ↓
Select Conversation
 ↓
Load Messages
 ↓
Continue Chat
```

---

# ⚙️ Response Settings

The application provides response customization.

Users can control:

### Explanation Level

```text
Beginner
    ↓
Intermediate
    ↓
Advanced
```

### Response Length

```text
Short
    ↓
Medium
    ↓
Detailed
```

These settings can influence how the AI formats and explains responses.

---

# 📡 REST API

## General

| Method | Endpoint      | Authentication | Description               |
| ------ | ------------- | -------------- | ------------------------- |
| GET    | `/api/config` | ❌              | Application configuration |
| GET    | `/api/health` | ❌              | Backend health check      |

---

## Authentication

| Method | Endpoint           | Authentication | Description    |
| ------ | ------------------ | -------------- | -------------- |
| POST   | `/api/auth/signup` | ❌              | Create account |
| POST   | `/api/auth/login`  | ❌              | Login          |
| GET    | `/api/auth/me`     | ✅              | Current user   |

---

## Chats

| Method | Endpoint                  | Authentication | Description                          |
| ------ | ------------------------- | -------------- | ------------------------------------ |
| GET    | `/api/chats`              | ✅              | Get user's chats                     |
| POST   | `/api/chats`              | ✅              | Create chat                          |
| GET    | `/api/chats/{id}`         | ✅              | Get chat and messages                |
| PATCH  | `/api/chats/{id}`         | ✅              | Rename chat                          |
| DELETE | `/api/chats/{id}`         | ✅              | Delete chat                          |
| POST   | `/api/chats/{id}/message` | ✅              | Send message and receive AI response |

---

## Voice

| Method | Endpoint                | Authentication | Description            |
| ------ | ----------------------- | -------------- | ---------------------- |
| POST   | `/api/voice/transcribe` | ✅              | Convert speech to text |

---

## Images

| Method | Endpoint                  | Authentication | Description              |
| ------ | ------------------------- | -------------- | ------------------------ |
| POST   | `/api/images/generate`    | ✅              | Generate AI image        |
| GET    | `/api/images/file/{name}` | ❌              | Serve generated image    |
| GET    | `/api/images/history`     | ✅              | Get user's image history |

---

# 📖 API Documentation

After starting the backend, interactive FastAPI documentation is available at:

```text
http://localhost:8000/api/docs
```

This allows developers to test API endpoints directly from the browser.

---

# ⚙️ Requirements

Before running the project, install:

* Python 3.11+
* Node.js 18+
* npm
* Git

You will also need:

* Groq API key
* OpenAI API key if using OpenAI features or image generation

---

# 🚀 Installation

## Step 1 — Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Enter the project:

```bash
cd AI-Chatbot--main
```

---

# 🐍 Backend Setup

## Step 2 — Create Virtual Environment

```bash
python -m venv .venv
```

---

## Step 3 — Activate Virtual Environment

### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
.venv\Scripts\activate
```

---

## Step 4 — Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# ⚛️ Frontend Setup

Open a new terminal or continue from the project root.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Return to project root:

```bash
cd ..
```

---

# 🔑 Environment Configuration

Create your `.env` file in the project root.

Example:

```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_long_random_secret
```

### Required API Keys

| Variable         | Required For         |
| ---------------- | -------------------- |
| `GROQ_API_KEY`   | Groq AI and Whisper  |
| `OPENAI_API_KEY` | OpenAI AI and DALL-E |
| `JWT_SECRET`     | JWT authentication   |

> OpenAI is optional if you only want to use Groq-based features. Image generation requires OpenAI.

---

# ▶️ Running the Application

There are two recommended ways to run the application.

---

## Option 1 — Production-Style Single Server

First build the React frontend:

```powershell
cd frontend
npm run build
cd ..
```

Then start the backend:

```powershell
python app.py
```

Open:

```text
http://localhost:8000
```

The backend serves the built React frontend.

---

# Option 2 — Development Mode

Development mode provides frontend hot reload.

You need two terminals.

### Terminal 1 — Backend

From the project root:

```powershell
.venv\Scripts\Activate.ps1
uvicorn backend.app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/api/docs
```

---

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Vite normally runs at:

```text
http://localhost:5173
```

---

# 🧪 Testing the Application

After starting the application, test it in this order.

## 1. Create Account

Open the application and select:

```text
Create Account
```

Enter:

```text
Name
Email
Password
```

---

## 2. Login

Log in with the newly created account.

Verify that the chatbot dashboard opens successfully.

---

## 3. Start Chat

Create a new conversation.

Try:

```text
Explain artificial intelligence in simple words.
```

Then ask a follow-up:

```text
Give me an example.
```

The chatbot should maintain the conversation context.

---

## 4. Test Chat History

Create multiple conversations.

Verify:

* Chats appear in sidebar
* Chats can be opened
* Chats can be renamed
* Chats can be deleted

---

## 5. Test Voice Input

Click the microphone button.

Allow browser microphone access.

Speak something such as:

```text
Explain machine learning.
```

The system should:

```text
Record
 ↓
Transcribe
 ↓
Insert text into chat
```

---

## 6. Test File Upload

Upload:

```text
PDF
DOCX
TXT
```

Ask the chatbot a question related to the document.

---

## 7. Test Image Generation

Provide an image prompt such as:

```text
Create a futuristic city powered by artificial intelligence.
```

The application should send the request to OpenAI DALL-E and return the generated image.

---

# 🛠️ Troubleshooting

## `vite is not recognized`

Run:

```powershell
cd frontend
npm install
npm run dev
```

---

## Vite Native Binding Error

If you receive a native binding/optional dependency error, perform a clean installation.

PowerShell:

```powershell
cd frontend

Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

npm install
npm run dev
```

---

## `GROQ_API_KEY missing`

Check that `.env` exists in the project root.

Example:

```env
GROQ_API_KEY=your_key_here
```

Restart the backend after changing environment variables.

---

## Image Generation Not Working

Check:

```env
OPENAI_API_KEY=your_openai_key
```

DALL-E image generation requires an OpenAI API key.

---

## Voice Input Not Working

Check:

* Browser microphone permission
* Microphone hardware
* Browser support for MediaRecorder
* Backend is running
* `GROQ_API_KEY` is configured

---

## Backend Module Not Found

Make sure you are running commands from the project root:

```text
AI-Chatbot--main/
```

Activate the virtual environment:

```powershell
.venv\Scripts\Activate.ps1
```

Then:

```bash
python app.py
```

or:

```bash
uvicorn backend.app.main:app --reload --port 8000
```

---

# 🔒 Security

Important security practices:

### Never commit `.env`

Add this to `.gitignore`:

```gitignore
.env
```

### Never expose API keys

Do not put:

```text
GROQ_API_KEY
OPENAI_API_KEY
JWT_SECRET
```

directly inside source code.

### Change JWT Secret

For production, use a strong random secret:

```env
JWT_SECRET=long-random-production-secret
```

### CORS

Before production deployment, restrict CORS origins to trusted frontend domains.

---

# 📦 Recommended `.gitignore`

Make sure your repository ignores:

```gitignore
.env
.venv/
venv/

__pycache__/
*.pyc

node_modules/
dist/

*.db
*.sqlite
*.sqlite3

backend/uploads/*
backend/generated_images/*

.DS_Store
.vscode/
```

Keep the `.gitkeep` files if you want GitHub to preserve empty folders.

---

# 🐙 GitHub Setup

If you want to upload this project to GitHub:

## Initialize Git

```bash
git init
```

---

## Check Status

```bash
git status
```

Make sure sensitive files such as `.env` are not being tracked.

---

## Add Files

```bash
git add .
```

---

## Commit

```bash
git commit -m "Initial commit - AI Info Generator"
```

---

## Connect GitHub

```bash
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
```

Check:

```bash
git remote -v
```

---

## Push

```bash
git branch -M main
git push -u origin main
```

---

# 🔄 Updating the Repository

After making changes:

```bash
git status
```

Then:

```bash
git add .
```

Commit:

```bash
git commit -m "Update chatbot features"
```

Push:

```bash
git push
```

---

# 🚨 If GitHub Rejects Your Push

If the GitHub repository already contains files such as a README:

```bash
git pull origin main --rebase
```

Then:

```bash
git push -u origin main
```

If Git reports conflicts, resolve them, then:

```bash
git add .
git rebase --continue
git push -u origin main
```

---

# 🌐 Deployment Architecture

For production, the application can be deployed as:

```text
                     INTERNET
                         │
                         ↓
                ┌─────────────────┐
                │ React Frontend  │
                │ Static Hosting  │
                └────────┬────────┘
                         │
                         ↓
                ┌─────────────────┐
                │ FastAPI Backend │
                │ Cloud Server    │
                └────────┬────────┘
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
          Database      Groq       OpenAI
             │           │           │
             ↓           ↓           ↓
          SQLite/     AI +        AI +
        PostgreSQL   Whisper      DALL-E
```

For production with multiple users, a server database such as **PostgreSQL** is generally preferable to SQLite.

---

# 🚀 Future Improvements

Possible improvements include:

* 🎙️ Real-time voice conversations
* 🔊 Text-to-speech AI responses
* 🧠 RAG knowledge base
* 📚 Vector database integration
* 📄 Better document understanding
* 🖼️ More advanced image generation
* 👁️ Advanced vision capabilities
* 🌐 More AI providers
* 🔄 Streaming AI responses
* 📊 User analytics
* 👨‍💼 Admin dashboard
* 🔔 Notifications
* ☁️ Cloud file storage
* 🐳 Docker deployment
* 🔄 GitHub Actions CI/CD
* 🗃️ PostgreSQL production database
* ⚡ Redis caching
* 🛡️ Rate limiting
* 📈 Application monitoring

---

# 🎯 Project Architecture Summary

The project follows a clean separation of responsibilities.

### React

Responsible for:

```text
UI
Chat
Authentication screens
Sidebar
Voice controls
File upload
Image generation UI
Settings
```

### FastAPI

Responsible for:

```text
REST APIs
Authentication
Authorization
Business logic
AI communication
File processing
Database operations
Image generation
Voice transcription
```

### AI Services

Responsible for:

```text
Groq
OpenAI
Whisper
DALL-E
```

### Database

Responsible for:

```text
Users
Chats
Messages
Image history
```

---

# 📊 Complete Feature Flow

```text
                         USER
                           │
                           ↓
                    ┌─────────────┐
                    │ Login/Signup│
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │ Chat Page   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ↓            ↓            ↓
            Text         Voice        File
              │            │            │
              │            ↓            ↓
              │         Whisper      Extract
              │            │          Text
              └────────────┼────────────┘
                           ↓
                    FastAPI Backend
                           │
                           ↓
                     AI Service
                     /        \
                   Groq       OpenAI
                    │            │
                    │       ┌────┴────┐
                    │       │         │
                    │     GPT-4o    DALL-E
                    │
                    ↓
                AI Response
                    │
                    ↓
                SQLite DB
                    │
                    ↓
               React Frontend
                    │
                    ↓
                   USER
```

---

# 🏆 Why This Project?

This project demonstrates how to build a modern AI application using a complete software architecture instead of only connecting a frontend directly to an AI API.

It demonstrates:

* Full-stack development
* REST API development
* React development
* FastAPI development
* Authentication
* Database integration
* AI API integration
* Voice processing
* Document processing
* Image generation
* Persistent conversations
* Responsive UI design
* Modular backend architecture

---

# ⚠️ Important Note

This application requires valid API credentials for the AI services being used.

API usage may incur costs depending on the provider, model, account, and usage limits.

Never publish API keys in a public GitHub repository.

---

# 👨‍💻 Author

**Samarth Sehdev**

GitHub:

```text
<YOUR_GITHUB_PROFILE_URL>
```

---

# ⭐ Support

If you find this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🐛 Report bugs
* 💡 Suggest improvements
* 🔧 Submit pull requests

---

# 📜 License

Add your preferred license to the repository.

For example:

```text
MIT License
```

If using the MIT License, add a `LICENSE` file to the project root.
