from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form

from backend.app.core.security import get_current_user
from backend.app.schemas.chat import CreateChatRequest, UpdateChatRequest
from backend.app.services.ai_service import generate_ai_response
from backend.app.services.document_service import (
    extract_file_text_bytes, make_image_data_url, is_image_file, is_document_file, get_file_icon
)
from backend.app.database.db import (
    get_user_conversations, create_conversation,
    get_conversation, update_conversation_title,
    delete_conversation, save_message, get_conversation_history
)

router = APIRouter(prefix="/api/chats", tags=["chats"])


@router.get("")
def get_chats(user: dict = Depends(get_current_user)):
    """List all conversations for the authenticated user."""
    chats = get_user_conversations(user["id"])
    return {"chats": chats}


@router.post("")
def create_chat(req: CreateChatRequest, user: dict = Depends(get_current_user)):
    """Create a new conversation."""
    chat = create_conversation(user["id"], req.title or "New Conversation")
    return chat


@router.get("/{chat_id}")
def get_chat_details(chat_id: int, user: dict = Depends(get_current_user)):
    """Get a conversation with its full message history."""
    chat = get_conversation(chat_id, user["id"])
    if not chat:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return chat


@router.patch("/{chat_id}")
def rename_chat(chat_id: int, req: UpdateChatRequest, user: dict = Depends(get_current_user)):
    """Rename a conversation."""
    new_title = req.title.strip()
    if not new_title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    success = update_conversation_title(chat_id, user["id"], new_title)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"id": chat_id, "title": new_title}


@router.delete("/{chat_id}")
def delete_chat(chat_id: int, user: dict = Depends(get_current_user)):
    """Delete a conversation and all its messages."""
    success = delete_conversation(chat_id, user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"success": True}


@router.post("/{chat_id}/message")
async def send_message(
    chat_id: str,
    prompt: str = Form(""),
    model: str = Form("Groq • GPT-OSS 120B"),
    level: str = Form("Beginner"),
    length: str = Form("Medium"),
    files: Optional[List[UploadFile]] = File(None),
    user: dict = Depends(get_current_user)
):
    """
    Send a message to a conversation and receive an AI response.
    Supports text prompts, file attachments (PDF/DOCX/TXT), and images (PNG/JPG/WEBP).
    Use chat_id='new' to auto-create a new conversation.
    """
    prompt_text = (prompt or "").strip()
    current_chat_id = None

    # Resolve existing conversation
    if chat_id != "new" and chat_id.isdigit():
        conv = get_conversation(int(chat_id), user["id"])
        if conv:
            current_chat_id = conv["id"]

    # Process uploaded files
    image_data_url = None
    document_text_parts = []
    attachment_metadata = []

    if files:
        for f in files:
            content_bytes = await f.read()
            if not content_bytes:
                continue
            fname = f.filename or "upload"
            attachment_metadata.append({
                "name": fname,
                "size": len(content_bytes),
                "type": f.content_type,
                "icon": get_file_icon(fname)
            })
            if is_image_file(fname):
                if not image_data_url:  # use first image only for vision
                    image_data_url = make_image_data_url(f.content_type, content_bytes)
            elif is_document_file(fname):
                extracted = extract_file_text_bytes(fname, content_bytes)
                if extracted:
                    document_text_parts.append(f"--- {fname} ---\n{extracted}")

    file_text = "\n\n".join(document_text_parts)

    # Default prompt if empty but files provided
    if not prompt_text:
        if image_data_url:
            prompt_text = "Please analyze the attached image and explain what you see in detail."
        elif file_text:
            prompt_text = "Please summarize and explain the attached file(s)."
        else:
            raise HTTPException(status_code=400, detail="Prompt or an attached file is required.")

    # Auto-create conversation if needed
    if not current_chat_id:
        title = prompt_text.replace("\n", " ").strip()
        title = (title[:65] + "…") if len(title) > 65 else title
        new_conv = create_conversation(user["id"], title)
        current_chat_id = new_conv["id"]

    # Load conversation history
    history = get_conversation_history(current_chat_id)

    # Build saved user message content (include attachment tags)
    user_saved_content = prompt_text
    if attachment_metadata:
        attach_tags = " ".join([
            f"[{a['icon']} {a['name']}]" for a in attachment_metadata
        ])
        user_saved_content = f"{prompt_text}\n\n{attach_tags}"

    user_msg_id, user_msg_time = save_message(current_chat_id, "user", user_saved_content, model)

    # Generate AI response
    try:
        ai_answer = generate_ai_response(
            model=model,
            prompt=prompt_text,
            history=history,
            level=level,
            length=length,
            image_data_url=image_data_url,
            file_text=file_text
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

    # Save assistant response
    assistant_msg_id, assistant_msg_time = save_message(current_chat_id, "assistant", ai_answer, model)

    # Get current conversation title
    conv = get_conversation(current_chat_id, user["id"])
    chat_title = conv["title"] if conv else "Conversation"

    return {
        "chat_id": current_chat_id,
        "chat_title": chat_title,
        "user_message": {
            "id": user_msg_id,
            "role": "user",
            "content": user_saved_content,
            "model": model,
            "created_at": user_msg_time,
            "attachments": attachment_metadata,
            "preview_image": image_data_url
        },
        "assistant_message": {
            "id": assistant_msg_id,
            "role": "assistant",
            "content": ai_answer,
            "model": model,
            "created_at": assistant_msg_time
        }
    }

