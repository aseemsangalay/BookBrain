from __future__ import annotations

import base64
import json
import logging
from typing import Optional

from supabase import create_client, Client
from app.config import SUPABASE_URL, SUPABASE_SERVICE_KEY

logger = logging.getLogger(__name__)

_client: Client | None = None


def _validate_service_role_key(key: str) -> None:
    """Warn if a JWT-format key does not carry the service_role claim.

    Non-JWT keys (e.g. the newer 'sb_secret_...' format) are accepted as-is
    because they carry no decodable role claim.
    """
    if not key.startswith("eyJ"):
        logger.info("Supabase client initialised with non-JWT key format.")
        return
    try:
        payload_b64 = key.split(".")[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)  # fix padding
        claims = json.loads(base64.b64decode(payload_b64))
        role = claims.get("role", "unknown")
        if role != "service_role":
            logger.warning(
                "SUPABASE_SERVICE_KEY has role=%r — expected 'service_role'. "
                "RLS will NOT be bypassed and writes to protected tables will fail. "
                "Go to Supabase dashboard → Settings → API and copy the "
                "'service_role' key (not the 'anon' key).",
                role,
            )
        else:
            logger.info("Supabase client initialised with service_role key.")
    except Exception:
        pass  # malformed key — supabase will raise its own error on first query


def get_db() -> Client:
    global _client
    if _client is None:
        _validate_service_role_key(SUPABASE_SERVICE_KEY)
        _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    return _client
