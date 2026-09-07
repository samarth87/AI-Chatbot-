from pydantic import BaseModel
from typing import Optional


class ImageGenerationRequest(BaseModel):
    prompt: str
    conversation_id: Optional[int] = None
    style: Optional[str] = "vivid"
    size: Optional[str] = "1024x1024"


class ImageGenerationResponse(BaseModel):
    success: bool
    image_url: str
    prompt: str
    id: Optional[int] = None

