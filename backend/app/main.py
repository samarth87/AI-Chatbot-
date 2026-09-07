"""
AI Info Generator — FastAPI Application Entry Point
Full-stack AI chatbot with Groq/OpenAI, voice, image generation, and file support.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from backend.app.core.config import APP_CONFIG, FRONTEND_DIST, IMAGES_DIR, UPLOADS_DIR

# API Routers
from backend.app.api import auth, chats, images, voice

# Ensure upload directories exist
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

# ─── FastAPI app ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="AI Info Generator API",
    description="Professional full-stack AI chatbot with multi-provider support, voice, vision, and image generation.",
    version="3.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# ─── CORS middleware ────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register routers ───────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(chats.router)
app.include_router(images.router)
app.include_router(voice.router)


# ─── System routes ──────────────────────────────────────────────────────────────

@app.get("/api/config")
def get_system_config():
    """Return application configuration: available models, levels, lengths, defaults, features."""
    return APP_CONFIG


@app.get("/api/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "version": "3.0.0"}


# ─── Frontend static serving ────────────────────────────────────────────────────

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        # Never intercept API paths
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # SPA fallback: return index.html for all other routes
        index = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index):
            return FileResponse(index)
        return JSONResponse(
            status_code=503,
            content={"detail": "Frontend not built. Run: cd frontend && npm run build"}
        )


if __name__ == "__main__":
    import uvicorn
    from backend.app.core.config import HOST, PORT
    print(f"Starting AI Info Generator at http://{HOST}:{PORT}")
    print(f"  API Docs: http://localhost:{PORT}/api/docs")
    uvicorn.run("backend.app.main:app", host=HOST, port=PORT, reload=True)

