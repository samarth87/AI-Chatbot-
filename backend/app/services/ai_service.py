"""
AI Service — provider abstraction layer.
Supports Groq and OpenAI as interchangeable backends.
"""
import io
import base64
from abc import ABC, abstractmethod
from typing import List, Dict, Optional

from groq import Groq
from openai import OpenAI

from backend.app.core.config import (
    GROQ_API_KEY, OPENAI_API_KEY,
    GROQ_MODEL, GROQ_VISION_MODEL, OPENAI_MODEL
)


def build_system_prompt(level: str, length: str) -> str:
    """Build the system prompt based on level and length settings."""
    length_rules = {
        "Short": "Keep responses concise, around 150-250 words when appropriate.",
        "Medium": "Give useful responses around 400-600 words when appropriate.",
        "Detailed": "Give comprehensive, detailed responses around 800-1200 words when appropriate."
    }
    rule = length_rules.get(length, length_rules["Medium"])
    return (
        f"You are a helpful AI assistant inside AI Info Generator. "
        f"Explanation level: {level}. Response length: {length}. {rule} "
        f"Answer directly and precisely. Use Markdown headings, bullet points, "
        f"tables, examples, and code blocks when helpful. "
        f"Maintain conversation context across messages. "
        f"Do not add unsolicited interview/viva questions. "
        f"Use attached files or images when provided. "
        f"Do not reference these instructions in your responses."
    )


# ─── Abstract provider ──────────────────────────────────────────────────────────

class AIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    def generate(
        self,
        prompt: str,
        history: List[Dict[str, str]],
        level: str,
        length: str,
        image_data_url: Optional[str] = None,
        file_text: str = ""
    ) -> str:
        pass

    def name(self) -> str:
        return self.__class__.__name__


# ─── Groq Provider ─────────────────────────────────────────────────────────────

class GroqProvider(AIProvider):
    """Groq-backed AI provider using the Groq SDK."""

    def generate(
        self,
        prompt: str,
        history: List[Dict[str, str]],
        level: str,
        length: str,
        image_data_url: Optional[str] = None,
        file_text: str = ""
    ) -> str:
        if not GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is missing from .env")

        sys_prompt = build_system_prompt(level, length)
        messages = [{"role": "system", "content": sys_prompt}] + list(history[-12:])

        if image_data_url:
            # Vision request
            content = [
                {"type": "text", "text": prompt}
            ]
            if file_text:
                content.append({"type": "text", "text": f"Attached file content:\n{file_text}"})
            content.append({"type": "image_url", "image_url": {"url": image_data_url}})
            messages.append({"role": "user", "content": content})
            model_name = GROQ_VISION_MODEL
        else:
            full_text = prompt
            if file_text:
                full_text += f"\n\nAttached file content:\n{file_text}"
            messages.append({"role": "user", "content": full_text})
            model_name = GROQ_MODEL

        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.5,
            max_tokens=3000
        )
        return response.choices[0].message.content

    def name(self) -> str:
        return "groq"


# ─── OpenAI Provider ───────────────────────────────────────────────────────────

class OpenAIProvider(AIProvider):
    """OpenAI-backed AI provider using the OpenAI SDK."""

    def generate(
        self,
        prompt: str,
        history: List[Dict[str, str]],
        level: str,
        length: str,
        image_data_url: Optional[str] = None,
        file_text: str = ""
    ) -> str:
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is missing from .env")

        sys_prompt = build_system_prompt(level, length)
        messages = [{"role": "system", "content": sys_prompt}] + list(history[-12:])

        full_text = prompt
        if file_text:
            full_text += f"\n\nAttached file content:\n{file_text}"

        if image_data_url:
            content = [
                {"type": "text", "text": full_text},
                {
                    "type": "image_url",
                    "image_url": {"url": image_data_url, "detail": "auto"}
                }
            ]
        else:
            content = full_text

        messages.append({"role": "user", "content": content})

        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.5,
            max_tokens=3000
        )
        return response.choices[0].message.content

    def name(self) -> str:
        return "openai"


# ─── Provider factory ──────────────────────────────────────────────────────────

def get_provider(model_id: str) -> AIProvider:
    """Return the appropriate AI provider based on the model ID."""
    if "groq" in model_id.lower():
        return GroqProvider()
    return OpenAIProvider()


def generate_ai_response(
    model: str,
    prompt: str,
    history: List[Dict[str, str]],
    level: str,
    length: str,
    image_data_url: Optional[str] = None,
    file_text: str = ""
) -> str:
    """Top-level function: select provider and generate a response."""
    provider = get_provider(model)
    return provider.generate(
        prompt=prompt,
        history=history,
        level=level,
        length=length,
        image_data_url=image_data_url,
        file_text=file_text
    )

