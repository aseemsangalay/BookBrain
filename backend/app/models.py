from __future__ import annotations
from datetime import date, datetime
from typing import Optional, Any
from pydantic import BaseModel, Field
from enum import Enum


class MediaType(str, Enum):
    book = "book"
    article = "article"
    podcast = "podcast"
    video = "video"
    paper = "paper"
    newsletter = "newsletter"


class MediaStatus(str, Enum):
    read = "read"
    reading = "reading"
    want = "want"


# ── Requests ────────────────────────────────────────────────────────────────

class MediaCreate(BaseModel):
    type: MediaType
    title: str
    author: Optional[str] = None
    url: Optional[str] = None
    cover_url: Optional[str] = None
    status: MediaStatus
    rating: Optional[int] = Field(None, ge=1, le=5)
    date_completed: Optional[date] = None
    source_metadata: Optional[dict[str, Any]] = None


class MediaUpdate(BaseModel):
    type: Optional[MediaType] = None
    title: Optional[str] = None
    author: Optional[str] = None
    url: Optional[str] = None
    cover_url: Optional[str] = None
    status: Optional[MediaStatus] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    date_completed: Optional[date] = None
    source_metadata: Optional[dict[str, Any]] = None


# ── Responses ────────────────────────────────────────────────────────────────

class MediaItem(BaseModel):
    id: str
    user_id: str
    type: MediaType
    title: str
    author: Optional[str] = None
    url: Optional[str] = None
    cover_url: Optional[str] = None
    status: MediaStatus
    rating: Optional[int] = None
    date_completed: Optional[date] = None
    ai_insight: Optional[str] = None
    source_metadata: Optional[dict[str, Any]] = None
    created_at: datetime


class UserProfile(BaseModel):
    id: str
    clerk_id: str
    username: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime


class ProfileResponse(BaseModel):
    profile: UserProfile
    stats: dict[str, int]
    recent_media: list[MediaItem]
    fingerprint: list[dict]


class ErrorResponse(BaseModel):
    error: str
    message: str
    status: int
