"""
AI Info Generator - Server Entrypoint
"""
import uvicorn
from backend.config import HOST, PORT
from backend.main import app

if __name__ == "__main__":
    print(f"✦ AI Info Generator backend running at http://{HOST}:{PORT}")
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)