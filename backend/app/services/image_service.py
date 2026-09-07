"""
Image generation service.
Uses OpenAI DALL-E 3 if key is available, otherwise returns a placeholder.
"""
import os
import uuid
import httpx
from typing import Optional

from backend.app.core.config import OPENAI_API_KEY, IMAGES_DIR


def generate_image(prompt: str, size: str = "1024x1024", style: str = "vivid") -> dict:
    """
    Generate an image from a text prompt using OpenAI DALL-E 3.
    Returns a dict with 'url' (remote) and 'local_path'.
    Falls back gracefully if OpenAI key is missing.
    """
    if not OPENAI_API_KEY:
        raise RuntimeError("Image generation requires OPENAI_API_KEY in .env")

    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size=size,
        quality="standard",
        style=style,
        n=1,
    )

    image_url = response.data[0].url
    revised_prompt = response.data[0].revised_prompt or prompt

    # Download and save locally
    local_filename = f"{uuid.uuid4().hex}.png"
    local_path = os.path.join(IMAGES_DIR, local_filename)

    os.makedirs(IMAGES_DIR, exist_ok=True)

    with httpx.Client(timeout=30) as http:
        img_response = http.get(image_url)
        img_response.raise_for_status()
        with open(local_path, "wb") as f:
            f.write(img_response.content)

    return {
        "url": image_url,
        "local_path": local_path,
        "local_filename": local_filename,
        "revised_prompt": revised_prompt
    }

