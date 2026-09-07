from pydantic import BaseModel
from typing import Optional, List


class CreateChatRequest(BaseModel):
    title: Optional[str] = "New Conversation"


class UpdateChatRequest(BaseModel):
    title: str


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    model: Optional[str] = None
    created_at: str


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: str
    updated_at: str
    messages: Optional[List[MessageResponse]] = None
    message_count: Optional[int] = None
    last_message: Optional[str] = None


class SendMessageResponse(BaseModel):
    chat_id: int
    chat_title: str
    user_message: dict
    assistant_message: dict

