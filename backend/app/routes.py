"""
FastAPI route handlers — all Phase 1 endpoints.
"""
from __future__ import annotations

import logging
import uuid
from datetime import date, timedelta
from typing import Annotated, Any

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.ai import generate_insight
from app.auth import get_current_user
from app.database import get_db
from app.models import (
    MediaCreate,
    MediaItem,
    MediaUpdate,
    ProfileResponse,
)

router = APIRouter()

# ── Helpers ──────────────────────────────────────────────────────────────────

def _err(code: str, msg: str, http_status: int) -> HTTPException:
    return HTTPException(
        status_code=http_status,
        detail={"error": code, "message": msg, "status": http_status},
    )


async def _ensure_user(clerk_payload: dict) -> dict:
    """
    Upsert the user row from the Clerk JWT sub claim.
    Returns the users row dict.
    """
    clerk_id: str = clerk_payload.get("sub", "")
    if not clerk_id:
        raise _err("unauthorized", "JWT missing sub", 401)

    db = get_db()
    result = db.table("users").select("*").eq("clerk_id", clerk_id).maybe_single().execute()

    if result and result.data:
        return result.data

    # Auto-create a thin profile row so we don't need a separate webhook
    username = clerk_payload.get("username") or clerk_id[:10]
    avatar = clerk_payload.get("image_url") or None
    new_user = {
        "id": str(uuid.uuid4()),
        "clerk_id": clerk_id,
        "username": username,
        "avatar_url": avatar,
    }
    insert_result = db.table("users").insert(new_user).execute()
    return insert_result.data[0]


def _build_activity_grid(user_id: str, db: Any) -> list[list[dict[str, Any]]]:
    # Build 26-week date range (182 days) ending today
    today = date.today()
    start = today - timedelta(weeks=26)

    result = (
        db.table("activity_log")
        .select("date, items_logged")
        .eq("user_id", user_id)
        .gte("date", start.isoformat())
        .lte("date", today.isoformat())
        .execute()
    )
    log_map: dict[str, int] = {
        row["date"]: row["items_logged"] for row in (result.data or [])
    }

    weeks: list[list[dict[str, Any]]] = []
    current_week: list[dict[str, Any]] = []
    cursor = start

    # Align to Monday
    while cursor.weekday() != 0:
        cursor -= timedelta(days=1)

    while cursor <= today:
        day_str = cursor.isoformat()
        current_week.append(
            {
                "date": day_str,
                "count": log_map.get(day_str, 0),
            }
        )
        if len(current_week) == 7:
            weeks.append(current_week)
            current_week = []
        cursor += timedelta(days=1)

    if current_week:
        weeks.append(current_week)

    return weeks


def _calculate_streak(user_id: str, db: Any) -> dict[str, int]:
    result = (
        db.table("activity_log")
        .select("date")
        .eq("user_id", user_id)
        .order("date", desc=True)
        .execute()
    )
    dates = sorted(
        {row["date"] for row in (result.data or [])}, reverse=True
    )

    if not dates:
        return {"current_streak": 0, "longest_streak": 0}

    current = 0
    check = date.today()
    for d in dates:
        d_parsed = date.fromisoformat(d)
        if d_parsed == check or d_parsed == check - timedelta(days=1):
            current += 1
            check = d_parsed - timedelta(days=1)
        else:
            break

    longest = 1
    run = 1
    sorted_asc = sorted(dates)
    for i in range(1, len(sorted_asc)):
        prev = date.fromisoformat(sorted_asc[i - 1])
        curr = date.fromisoformat(sorted_asc[i])
        if (curr - prev).days == 1:
            run += 1
            longest = max(longest, run)
        else:
            run = 1

    return {"current_streak": current, "longest_streak": max(longest, current)}


# ── Media CRUD ───────────────────────────────────────────────────────────────

@router.post("/media", response_model=MediaItem, status_code=201)
async def create_media(
    body: MediaCreate,
    request: Request,
    payload: Annotated[dict, Depends(get_current_user)],
):
    user = await _ensure_user(payload)
    user_id: str = user["id"]

    # Generate AI insight (best-effort)
    insight: str | None = None
    try:
        insight = generate_insight(
            title=body.title,
            media_type=body.type.value,
            author=body.author,
            status=body.status.value,
        )
    except Exception as e:
        logger.warning("AI insight generation failed: %s", e)

    db = get_db()
    row = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "type": body.type.value,
        "title": body.title,
        "author": body.author,
        "url": body.url,
        "cover_url": body.cover_url,
        "status": body.status.value,
        "rating": body.rating,
        "date_completed": body.date_completed.isoformat() if body.date_completed else None,
        "ai_insight": insight,
        "source_metadata": body.source_metadata,
    }
    result = db.table("media_items").insert(row).execute()

    # Log activity
    today = date.today().isoformat()
    existing = (
        db.table("activity_log")
        .select("*")
        .eq("user_id", user_id)
        .eq("date", today)
        .maybe_single()
        .execute()
    )
    if existing and existing.data:
        db.table("activity_log").update(
            {"items_logged": existing.data["items_logged"] + 1}
        ).eq("id", existing.data["id"]).execute()
    else:
        db.table("activity_log").insert(
            {"id": str(uuid.uuid4()), "user_id": user_id, "date": today, "items_logged": 1}
        ).execute()

    return result.data[0]


@router.get("/media", response_model=list[MediaItem])
async def list_media(
    payload: Annotated[dict, Depends(get_current_user)],
):
    user = await _ensure_user(payload)
    db = get_db()
    result = (
        db.table("media_items")
        .select("*")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.patch("/media/{item_id}", response_model=MediaItem)
async def update_media(
    item_id: str,
    body: MediaUpdate,
    payload: Annotated[dict, Depends(get_current_user)],
):
    user = await _ensure_user(payload)
    db = get_db()

    # Ownership check
    existing = (
        db.table("media_items")
        .select("id, user_id")
        .eq("id", item_id)
        .maybe_single()
        .execute()
    )
    if not existing or not existing.data:
        raise _err("not_found", "Media item not found", 404)
    if existing.data["user_id"] != user["id"]:
        raise _err("forbidden", "You do not own this item", 403)

    updates = body.model_dump(exclude_unset=True)
    if "date_completed" in updates and updates["date_completed"]:
        updates["date_completed"] = updates["date_completed"].isoformat()
    if "type" in updates:
        updates["type"] = updates["type"].value if hasattr(updates["type"], "value") else updates["type"]
    if "status" in updates:
        updates["status"] = updates["status"].value if hasattr(updates["status"], "value") else updates["status"]

    result = (
        db.table("media_items").update(updates).eq("id", item_id).execute()
    )
    return result.data[0]


@router.delete("/media/{item_id}", status_code=204)
async def delete_media(
    item_id: str,
    payload: Annotated[dict, Depends(get_current_user)],
):
    user = await _ensure_user(payload)
    db = get_db()

    existing = (
        db.table("media_items")
        .select("id, user_id")
        .eq("id", item_id)
        .maybe_single()
        .execute()
    )
    if not existing or not existing.data:
        raise _err("not_found", "Media item not found", 404)
    if existing.data["user_id"] != user["id"]:
        raise _err("forbidden", "You do not own this item", 403)

    db.table("media_items").delete().eq("id", item_id).execute()
    return None


# ── Public profile ───────────────────────────────────────────────────────────

@router.get("/profile/{username}")
async def get_profile(username: str):
    db = get_db()
    user_res = (
        db.table("users")
        .select("*")
        .eq("username", username)
        .maybe_single()
        .execute()
    )
    if not user_res or not user_res.data:
        raise _err("not_found", "User not found", 404)

    user = user_res.data
    user_id = user["id"]

    media_res = (
        db.table("media_items")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    all_media: list[dict] = media_res.data or []

    # Stats
    type_counts: dict[str, int] = {}
    for item in all_media:
        t = item.get("type", "other")
        type_counts[t] = type_counts.get(t, 0) + 1

    stats = {
        "total": len(all_media),
        "books": type_counts.get("book", 0),
        "articles": type_counts.get("article", 0),
        "podcasts": type_counts.get("podcast", 0),
        "videos": type_counts.get("video", 0),
        "papers": type_counts.get("paper", 0),
        "newsletters": type_counts.get("newsletter", 0),
    }

    recent_media = all_media[:6]

    # Fingerprint — theme % breakdown by type
    total = len(all_media) or 1
    fingerprint = [
        {"theme": t, "count": c, "pct": round(c / total * 100)}
        for t, c in sorted(type_counts.items(), key=lambda x: -x[1])
    ]

    # Activity grid
    activity_grid_weeks = _build_activity_grid(user_id, db)

    # Streak
    streak = _calculate_streak(user_id, db)

    return {
        "profile": user,
        "stats": stats,
        "recent_media": recent_media,
        "fingerprint": fingerprint,
        "activity_grid_weeks": activity_grid_weeks,
        "current_streak": streak["current_streak"],
        "longest_streak": streak["longest_streak"],
    }


# ── Stats endpoints ──────────────────────────────────────────────────────────

@router.get("/stats/activity-grid")
async def stats_activity_grid(
    payload: Annotated[dict, Depends(get_current_user)],
):
    """Returns 26-week array of arrays: [[day0, day1, ...week0], [week1...], ...]"""
    user = await _ensure_user(payload)
    db = get_db()
    weeks = _build_activity_grid(user["id"], db)
    return {"weeks": weeks}


@router.get("/stats/streak")
async def stats_streak(
    payload: Annotated[dict, Depends(get_current_user)],
):
    user = await _ensure_user(payload)
    db = get_db()
    return _calculate_streak(user["id"], db)


@router.get("/stats/fingerprint")
async def stats_fingerprint(
    payload: Annotated[dict, Depends(get_current_user)],
):
    user = await _ensure_user(payload)
    db = get_db()

    result = (
        db.table("media_items")
        .select("type")
        .eq("user_id", user["id"])
        .execute()
    )
    items: list[dict] = result.data or []
    total = len(items) or 1
    type_counts: dict[str, int] = {}
    for item in items:
        t = item.get("type", "other")
        type_counts[t] = type_counts.get(t, 0) + 1

    fingerprint = [
        {"theme": t, "count": c, "pct": round(c / total * 100)}
        for t, c in sorted(type_counts.items(), key=lambda x: -x[1])
    ]
    return {"fingerprint": fingerprint}
