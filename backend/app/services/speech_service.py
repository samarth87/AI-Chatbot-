"""
Speech / voice transcription service using Groq Whisper.
"""
import io
from typing import Optional

from backend.app.core.config import GROQ_API_KEY


def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """
    Transcribe audio bytes using Groq's Whisper implementation.
    Accepts WebM, MP3, WAV, OGG, M4A, FLAC.
    Returns the transcribed text string.
    """
    if not GROQ_API_KEY:
        raise RuntimeError("Voice transcription requires GROQ_API_KEY in .env")

    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)

    audio_file = (filename, io.BytesIO(audio_bytes), _get_mime(filename))

    transcription = client.audio.transcriptions.create(
        file=audio_file,
        model="whisper-large-v3",
        response_format="text",
        language="en",
        temperature=0.0
    )
    return str(transcription).strip()


def _get_mime(filename: str) -> str:
    """Determine MIME type from filename extension."""
    ext = filename.lower().split(".")[-1]
    mime_map = {
        "webm": "audio/webm",
        "mp3": "audio/mpeg",
        "wav": "audio/wav",
        "ogg": "audio/ogg",
        "m4a": "audio/mp4",
        "flac": "audio/flac",
        "mp4": "audio/mp4"
    }
    return mime_map.get(ext, "audio/webm")

