"""
Clerk JWT validation middleware.

Clerk JWTs are standard RS256 JWTs. We pull the JWKS from Clerk's well-known
endpoint and validate the signature + claims on every protected request.
"""
from __future__ import annotations

import httpx
from fastapi import HTTPException, Request, status
from jose import jwt, JWTError
from app.config import CLERK_JWKS_URL, AUTH_MODE

_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache
    async with httpx.AsyncClient() as client:
        resp = await client.get(CLERK_JWKS_URL, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache


async def get_current_user(request: Request) -> dict:
    """
    Extract and validate the Clerk JWT from the Authorization header.
    Returns the decoded payload (sub = clerk_id, etc.).

    Dev mode (AUTH_MODE=dev): skips JWT validation entirely.
    Pass X-Dev-User-Id header with any user identifier (used as the Clerk sub claim).
    """
    if AUTH_MODE == "dev":
        dev_user_id = request.headers.get("X-Dev-User-Id")
        if not dev_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "error": "unauthorized",
                    "message": "AUTH_MODE=dev: provide X-Dev-User-Id header",
                    "status": 401,
                },
            )
        return {"sub": dev_user_id}

    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": "Missing bearer token", "status": 401},
        )
    token = auth[7:]
    try:
        header = jwt.get_unverified_header(token)
        jwks = await _get_jwks()
        key = next(
            (k for k in jwks.get("keys", []) if k.get("kid") == header.get("kid")),
            None,
        )
        if key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"error": "unauthorized", "message": "No matching JWK found", "status": 401},
            )
        payload = jwt.decode(token, key, algorithms=["RS256"])
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": str(exc), "status": 401},
        ) from exc
