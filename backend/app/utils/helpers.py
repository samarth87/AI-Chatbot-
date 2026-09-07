"""
Utility helpers — shared across the application.
"""
import re
import os
import uuid
from typing import Optional


def slugify(text: str, max_length: int = 80) -> str:
    """Convert text to a clean title slug (truncated)."""
    text = re.sub(r"\s+", " ", text).strip()
    return (text[:max_length] + "…") if len(text) > max_length else text


def safe_filename(filename: str) -> str:
    """Sanitize a filename to prevent path traversal."""
    base = os.path.basename(filename)
    clean = re.sub(r"[^\w.\-]", "_", base)
    return clean or "upload"


def unique_filename(filename: str) -> str:
    """Prefix a filename with a UUID to guarantee uniqueness."""
    name, ext = os.path.splitext(safe_filename(filename))
    return f"{uuid.uuid4().hex}_{name}{ext}"


def format_file_size(size_bytes: int) -> str:
    """Return a human-readable file size string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    if size_bytes < 1024 ** 2:
        return f"{size_bytes / 1024:.1f} KB"
    return f"{size_bytes / 1024 ** 2:.1f} MB"


def truncate_text(text: str, max_chars: int = 500) -> str:
    """Truncate text to max_chars, appending an ellipsis if needed."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rstrip() + "…"

