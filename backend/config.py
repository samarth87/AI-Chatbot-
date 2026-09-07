import os
from dotenv import load_dotenv

# Root Directory Paths
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)
DB_PATH = os.path.join(ROOT_DIR, "info_generator.db")
FRONTEND_DIST = os.path.join(ROOT_DIR, "frontend", "dist")

# Load .env file from root
load_dotenv(os.path.join(ROOT_DIR, ".env"))

# Security / JWT
JWT_SECRET = os.getenv("JWT_SECRET", "ai-info-generator-secret-key-2026-secure-token")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_SECONDS = 30 * 24 * 3600  # 30 Days

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# AI Models
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
GROQ_VISION_MODEL = os.getenv("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6")

# Server Config
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

# System Capabilities & Presets
APP_CONFIG = {
    "models": [
        {
            "id": "Groq • GPT-OSS 120B",
            "name": "Groq • GPT-OSS 120B (Ultra Fast)",
            "provider": "Groq",
            "badge": "Fast"
        },
        {
            "id": "OpenAI • GPT-5.6",
            "name": "OpenAI • GPT-5.6 (Advanced Intelligence)",
            "provider": "OpenAI",
            "badge": "Smart"
        }
    ],
    "levels": ["Beginner", "Intermediate", "Advanced"],
    "lengths": ["Short", "Medium", "Detailed"],
    "defaults": {
        "model": "Groq • GPT-OSS 120B",
        "level": "Beginner",
        "length": "Medium"
    }
}