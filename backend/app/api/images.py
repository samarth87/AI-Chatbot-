import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse

from backend.app.core.security import get_current_user
from backend.app.core.config import IMAGES_DIR
from backend.app.schemas.images import ImageGenerationRequest
from backend.app.services.image_service import generate_image
from backend.app.database.db import save_generated_image, get_user_generated_images

router = APIRouter(prefix="/api/images", tags=["images"])


@router.post("/generate")
def generate_image_endpoint(
    req: ImageGenerationRequest,
    user: dict = Depends(get_current_user)
):
    """
    Generate an image from a text prompt using DALL-E 3.
    Requires OPENAI_API_KEY to be set in .env.
    """
    if not req.prompt or len(req.prompt.strip()) < 3:
        raise HTTPException(status_code=400, detail="Prompt must be at least 3 characters.")

    try:
        result = generate_image(
            prompt=req.prompt.strip(),
            size=req.size or "1024x1024",
            style=req.style or "vivid"
        )
        img_id = save_generated_image(
            user_id=user["id"],
            conversation_id=req.conversation_id,
            prompt=req.prompt.strip(),
            image_path=result["local_path"],
            model="dall-e-3"
        )
        return {
            "success": True,
            "id": img_id,
            "image_url": f"/api/images/file/{result['local_filename']}",
            "prompt": req.prompt.strip(),
            "revised_prompt": result.get("revised_prompt", req.prompt.strip())
        }
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")


@router.get("/file/{filename}")
def serve_generated_image(filename: str):
    """Serve a locally saved generated image by filename."""
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(IMAGES_DIR, safe_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path, media_type="image/png")


@router.get("/history")
def get_image_history(user: dict = Depends(get_current_user)):
    """Get the authenticated user's image generation history."""
    images = get_user_generated_images(user["id"])
    return {"images": images}

