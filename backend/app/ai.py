"""
AI service — generates a 1-sentence insight for a media item.

Provider is selected via the AI_PROVIDER env variable (default: "groq"):
  "groq"      — Groq API, model: llama-3.3-70b-versatile (uses httpx, no extra SDK)
  "anthropic" — Anthropic API, model: claude-haiku-4-5-20251001 (uses anthropic SDK)

Both providers call the same generate_insight() function with the same signature.
"""
from __future__ import annotations

import os
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

AI_PROVIDER = os.environ.get("AI_PROVIDER", "groq")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

SYSTEM_PROMPT = (
    "You are an intellectual reading companion. "
    "Given a media item, write exactly ONE concise, insightful sentence "
    "that captures its unique value or core idea. "
    "Be specific, not generic. Avoid phrases like 'this book explores'."
)


def _groq_insight(user_msg: str) -> str:
    """Call Groq's OpenAI-compatible chat endpoint via httpx."""
    resp = httpx.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            "max_tokens": 120,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()


def _anthropic_insight(user_msg: str) -> str:
    """Call Anthropic API via the anthropic SDK."""
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=120,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )
    return message.content[0].text.strip()


def generate_insight(
    title: str,
    media_type: str,
    author: Optional[str] = None,
    status: str = "read",
) -> str:
    author_part = f" by {author}" if author else ""
    user_msg = (
        f"Generate a 1-sentence insight for: "
        f'"{title}"{author_part} ({media_type}, status: {status})'
    )
    if AI_PROVIDER == "anthropic":
        return _anthropic_insight(user_msg)
    return _groq_insight(user_msg)
