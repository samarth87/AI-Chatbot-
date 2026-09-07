import os
from dotenv import load_dotenv
from pathlib import Path

# Root directory paths
BACKEND_DIR = Path(__file__).parent.parent.parent  # backend/
ROOT_DIR = BACKEND_DIR.parent                       # project root
DB_PATH = str(ROOT_DIR / "info_generator.db")
FRONTEND_DIST = str(ROOT_DIR / "frontend" / "dist")
UPLOADS_DIR = str(BACKEND_DIR / "uploads")
IMAGES_DIR = str(BACKEND_DIR / "generated_images")

# Load .env file from root
load_dotenv(ROOT_DIR / ".env")

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
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

# Server Config
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

# Max file sizes
MAX_FILE_SIZE_MB = 20
MAX_IMAGE_SIZE_MB = 10

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
            "id": "OpenAI • GPT-4o",
            "name": "OpenAI • GPT-4o (Advanced)",
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
    },
    "features": {
        "voice": True,
        "image_generation": True,
        "file_upload": True,
        "vision": True
    }
}

