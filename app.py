"""
AI Info Generator — Application Launcher
Run this file to start the backend server.

Usage:
    python app.py
    # or
    uvicorn backend.app.main:app --reload --port 8000
"""
import uvicorn

if __name__ == "__main__":
    print("=" * 55)
    print("  AI Info Generator v3.0 — Starting Server")
    print("=" * 55)
    print("  Backend:  http://localhost:8000")
    print("  API Docs: http://localhost:8000/api/docs")
    print("  Frontend: http://localhost:8000  (after npm run build)")
    print("  Dev UI:   http://localhost:5173  (npm run dev)")
    print("=" * 55)
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["backend"]
    )