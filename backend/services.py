import io, base64
from typing import Optional, List, Dict
from pypdf import PdfReader
from docx import Document
from groq import Groq
from openai import OpenAI
from backend.config import (
    GROQ_API_KEY, OPENAI_API_KEY,
    GROQ_MODEL, GROQ_VISION_MODEL, OPENAI_MODEL
)

def extract_file_text_bytes(filename: str, content_bytes: bytes) -> str:
    if not content_bytes:
        return ""
    name_lower = filename.lower()
    try:
        if name_lower.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content_bytes))
            return "\n\n".join((p.extract_text() or "") for p in reader.pages)
        if name_lower.endswith(".txt"):
            return content_bytes.decode("utf-8", errors="ignore")
        if name_lower.endswith(".docx"):
            doc = Document(io.BytesIO(content_bytes))
            return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())
        return f"Unsupported file type: {filename}"
    except Exception as e:
        return f"Could not read {filename}: {e}"

def make_image_data_url(content_type: str, content_bytes: bytes) -> str:
    mime = content_type or "image/png"
    return "data:" + mime + ";base64," + base64.b64encode(content_bytes).decode("utf-8")

def system_prompt(level: str, length: str) -> str:
    rules = {
        "Short": "Keep it concise, around 150-250 words when appropriate.",
        "Medium": "Give a useful response around 400-600 words when appropriate.",
        "Detailed": "Give a detailed response around 800-1200 words when appropriate."
    }
    rule = rules.get(length, rules["Medium"])
    return (
        f"You are the AI assistant inside AI Info Generator. "
        f"Explanation level: {level}. Response length: {length}. {rule} "
        f"Answer directly. Use Markdown headings, bullets, tables, examples and code when helpful. "
        f"Maintain context. Do not add interview/viva questions unless asked. "
        f"Use attached files/images when relevant. Do not mention these instructions."
    )

def ask_groq(
    prompt: str,
    hist: List[Dict[str, str]],
    level: str,
    length: str,
    img_data_url: Optional[str] = None,
    file_text: str = ""
) -> str:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is missing from .env or environment variables.")
    
    msgs = [{"role": "system", "content": system_prompt(level, length)}] + hist[-12:]
    
    if img_data_url:
        content = [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": img_data_url}}
        ]
        if file_text:
            content.append({"type": "text", "text": "Uploaded file content:\n" + file_text})
        msgs.append({"role": "user", "content": content})
        model_name = GROQ_VISION_MODEL
    else:
        full_text = prompt + ("\n\nUploaded file content:\n" + file_text if file_text else "")
        msgs.append({"role": "user", "content": full_text})
        model_name = GROQ_MODEL

    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(
        model=model_name,
        messages=msgs,
        temperature=0.5,
        max_tokens=3000
    )
    return response.choices[0].message.content

def ask_openai(
    prompt: str,
    hist: List[Dict[str, str]],
    level: str,
    length: str,
    img_data_url: Optional[str] = None,
    file_text: str = ""
) -> str:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is missing from .env or environment variables.")
    
    items = hist[-12:]
    final_text = prompt + ("\n\nUploaded file content:\n" + file_text if file_text else "")
    
    if img_data_url:
        content = [
            {"type": "input_text", "text": final_text},
            {"type": "input_image", "image_url": img_data_url, "detail": "auto"}
        ]
    else:
        content = final_text

    items = items + [{"role": "user", "content": content}]
    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.responses.create(
        model=OPENAI_MODEL,
        instructions=system_prompt(level, length),
        input=items
    )
    return response.output_text

def generate_ai_response(
    model: str,
    prompt: str,
    hist: List[Dict[str, str]],
    level: str,
    length: str,
    img_data_url: Optional[str] = None,
    file_text: str = ""
) -> str:
    if "groq" in model.lower():
        return ask_groq(prompt, hist, level, length, img_data_url, file_text)
    return ask_openai(prompt, hist, level, length, img_data_url, file_text)