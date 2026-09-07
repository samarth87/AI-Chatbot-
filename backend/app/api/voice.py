from fastapi import APIRouter, HTTPException, UploadFile, File, Depends

from backend.app.core.security import get_current_user
from backend.app.services.speech_service import transcribe_audio

router = APIRouter(prefix="/api/voice", tags=["voice"])

ALLOWED_AUDIO_TYPES = {
    "audio/webm", "audio/wav", "audio/mpeg", "audio/mp3",
    "audio/ogg", "audio/mp4", "audio/flac", "audio/x-m4a"
}
MAX_AUDIO_SIZE = 25 * 1024 * 1024  # 25 MB (Whisper limit)


@router.post("/transcribe")
async def transcribe_voice(
    audio: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Transcribe a recorded audio file to text using Groq Whisper.
    Accepts: WebM, WAV, MP3, OGG, M4A, FLAC.
    Max size: 25 MB. Requires GROQ_API_KEY.
    """
    audio_bytes = await audio.read()

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio file is empty.")
    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise HTTPException(status_code=413, detail="Audio file too large. Max 25 MB.")

    try:
        text = transcribe_audio(audio_bytes, filename=audio.filename or "recording.webm")
        if not text:
            raise HTTPException(status_code=422, detail="Could not transcribe audio. Please try again.")
        return {"success": True, "text": text}
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

