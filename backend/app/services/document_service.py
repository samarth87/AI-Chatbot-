"""
Document service — file text extraction and image data URL helpers.
"""
import io
import base64
from typing import Optional


def extract_file_text_bytes(filename: str, content_bytes: bytes) -> str:
    """Extract readable text from PDF, DOCX, or TXT file bytes."""
    if not content_bytes:
        return ""
    name_lower = filename.lower()
    try:
        if name_lower.endswith(".pdf"):
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content_bytes))
            return "\n\n".join((p.extract_text() or "") for p in reader.pages)
        if name_lower.endswith(".txt"):
            return content_bytes.decode("utf-8", errors="ignore")
        if name_lower.endswith(".docx"):
            from docx import Document
            doc = Document(io.BytesIO(content_bytes))
            return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())
        return f"Unsupported file type: {filename}"
    except Exception as e:
        return f"Could not read {filename}: {e}"


def make_image_data_url(content_type: str, content_bytes: bytes) -> str:
    """Convert image bytes to a base64 data URL."""
    mime = content_type or "image/png"
    b64 = base64.b64encode(content_bytes).decode("utf-8")
    return f"data:{mime};base64,{b64}"


def is_image_file(filename: str) -> bool:
    """Return True if filename has an image extension."""
    return filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif"))


def is_document_file(filename: str) -> bool:
    """Return True if filename has a document extension."""
    return filename.lower().endswith((".pdf", ".txt", ".docx"))


def get_file_icon(filename: str) -> str:
    """Return an emoji icon for the file type."""
    if is_image_file(filename):
        return "🖼️"
    if filename.lower().endswith(".pdf"):
        return "📄"
    if filename.lower().endswith(".docx"):
        return "📝"
    if filename.lower().endswith(".txt"):
        return "📃"
    return "📎"

