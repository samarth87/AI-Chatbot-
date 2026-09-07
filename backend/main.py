import os, re
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.config import APP_CONFIG, FRONTEND_DIST, PORT, HOST
from backend.database import (
    create_user, get_user_by_identifier,
    get_user_conversations, create_conversation,
    get_conversation, update_conversation_title,
    delete_conversation, save_message, get_conversation_history
)
from backend.auth import hash_password, verify_password, create_jwt_token, get_current_user
from backend.services import extract_file_text_bytes, make_image_data_url, generate_ai_response

app = FastAPI(
    title="AI Info Generator API",
    description="Backend API service for AI Info Generator",
    version="2.0.0"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request validation schemas
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    identifier: str
    password: str

class CreateChatRequest(BaseModel):
    title: Optional[str] = "New Conversation"

class UpdateChatRequest(BaseModel):
    title: str

# Config Route
@app.get("/api/config")
def get_system_config():
    return APP_CONFIG

# Auth Routes
@app.post("/api/auth/signup")
def signup(req: SignupRequest):
    u = req.username.strip()
    e = req.email.strip().lower()
    p = req.password

    if not u or not e or not p:
        raise HTTPException(status_code=400, detail="Please fill in all fields.")
    if len(u) < 3:
        raise HTTPException(status_code=400, detail="Username must contain at least 3 characters.")
    if len(p) < 6:
        raise HTTPException(status_code=400, detail="Password must contain at least 6 characters.")
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", e):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")

    try:
        user_id = create_user(u, e, hash_password(p))
        token = create_jwt_token(user_id, u, e)
        return {
            "success": True,
            "message": "Account created successfully.",
            "token": token,
            "user": {"id": user_id, "username": u, "email": e}
        }
    except Exception as err:
        # SQLite UNIQUE constraint
        if "UNIQUE" in str(err) or "IntegrityError" in str(type(err)):
            raise HTTPException(status_code=400, detail="That username or email is already registered.")
        raise HTTPException(status_code=500, detail=str(err))

@app.post("/api/auth/login")
def login(req: LoginRequest):
    user_row = get_user_by_identifier(req.identifier)
    if not user_row or not verify_password(req.password, user_row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username/email or password.")

    user_data = {
        "id": user_row["id"],
        "username": user_row["username"],
        "email": user_row["email"]
    }
    token = create_jwt_token(user_data["id"], user_data["username"], user_data["email"])
    return {
        "success": True,
        "token": token,
        "user": user_data
    }

@app.get("/api/auth/me")
def me(user: dict = Depends(get_current_user)):
    return {"user": user}

# Conversation Routes
@app.get("/api/chats")
def get_chats(user: dict = Depends(get_current_user)):
    chats = get_user_conversations(user["id"])
    return {"chats": chats}

@app.post("/api/chats")
def create_chat(req: CreateChatRequest, user: dict = Depends(get_current_user)):
    chat = create_conversation(user["id"], req.title or "New Conversation")
    return chat

@app.get("/api/chats/{chat_id}")
def get_chat_details(chat_id: int, user: dict = Depends(get_current_user)):
    chat = get_conversation(chat_id, user["id"])
    if not chat:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return chat

@app.patch("/api/chats/{chat_id}")
def rename_chat(chat_id: int, req: UpdateChatRequest, user: dict = Depends(get_current_user)):
    new_title = req.title.strip()
    if not new_title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    
    success = update_conversation_title(chat_id, user["id"], new_title)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"id": chat_id, "title": new_title}

@app.delete("/api/chats/{chat_id}")
def delete_chat(chat_id: int, user: dict = Depends(get_current_user)):
    success = delete_conversation(chat_id, user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"success": True}

# Messaging & AI Inference Route
@app.post("/api/chats/{chat_id}/message")
async def send_message(
    chat_id: str,
    prompt: str = Form(""),
    model: str = Form("Groq • GPT-OSS 120B"),
    level: str = Form("Beginner"),
    length: str = Form("Medium"),
    files: Optional[List[UploadFile]] = File(None),
    user: dict = Depends(get_current_user)
):
    prompt_text = (prompt or "").strip()

    # Determine or create conversation
    current_chat_id = None
    if chat_id != "new" and chat_id.isdigit():
        conv = get_conversation(int(chat_id), user["id"])
        if conv:
            current_chat_id = conv["id"]

    image_data_url = None
    document_text_parts = []
    attachment_metadata = []

    if files:
        for f in files:
            content_bytes = await f.read()
            if not content_bytes:
                continue
            fname = f.filename or "upload"
            name_lower = fname.lower()
            attachment_metadata.append({
                "name": fname,
                "size": len(content_bytes),
                "type": f.content_type
            })

            if name_lower.endswith((".png", ".jpg", ".jpeg", ".webp")):
                if not image_data_url:
                    image_data_url = make_image_data_url(f.content_type, content_bytes)
            elif name_lower.endswith((".pdf", ".txt", ".docx")):
                extracted = extract_file_text_bytes(fname, content_bytes)
                if extracted:
                    document_text_parts.append(f"--- {fname} ---\n{extracted}")

    file_text = "\n\n".join(document_text_parts)

    if not prompt_text:
        if image_data_url:
            prompt_text = "Please analyze the attached image and explain what you see."
        elif file_text:
            prompt_text = "Please summarize and explain the attached file(s)."
        else:
            raise HTTPException(status_code=400, detail="Prompt or attached file is required.")

    if not current_chat_id:
        title = prompt_text.replace("\n", " ").strip()
        title = (title[:65] + "…") if len(title) > 65 else title
        new_conv = create_conversation(user["id"], title)
        current_chat_id = new_conv["id"]

    # Retrieve history
    hist = get_conversation_history(current_chat_id)

    # Save user message
    user_saved_content = prompt_text
    if attachment_metadata:
        attach_tags = " ".join([
            f"[{'🖼️' if a['name'].lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) else '📎'} {a['name']}]"
            for a in attachment_metadata
        ])
        user_saved_content = f"{prompt_text}\n\n{attach_tags}"

    user_msg_id, user_msg_time = save_message(current_chat_id, "user", user_saved_content)

    # Generate AI response
    try:
        ai_answer = generate_ai_response(
            model=model,
            prompt=prompt_text,
            hist=hist,
            level=level,
            length=length,
            img_data_url=image_data_url,
            file_text=file_text
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

    # Save assistant response
    assistant_msg_id, assistant_msg_time = save_message(current_chat_id, "assistant", ai_answer)

    # Retrieve updated title
    conv = get_conversation(current_chat_id, user["id"])
    chat_title = conv["title"] if conv else "Conversation"

    return {
        "chat_id": current_chat_id,
        "chat_title": chat_title,
        "user_message": {
            "id": user_msg_id,
            "role": "user",
            "content": user_saved_content,
            "created_at": user_msg_time,
            "attachments": attachment_metadata,
            "preview_image": image_data_url
        },
        "assistant_message": {
            "id": assistant_msg_id,
            "role": "assistant",
            "content": ai_answer,
            "created_at": assistant_msg_time
        }
    }

# Static file serving (React Frontend SPA)
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    print(f"Starting AI Info Generator at http://{HOST}:{PORT}")
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)