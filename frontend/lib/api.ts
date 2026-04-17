import {
    ActivityGridResponse,
    FingerprintItem,
    MediaCreate,
    MediaItem,
    ProfileResponse,
    StreakResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE || "prod";

async function apiFetch<T>(
    path: string,
    options: RequestInit & { token?: string } = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
    };
    if (AUTH_MODE === "dev") {
        headers["X-Dev-User-Id"] = "dev-user-123";
    } else if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...fetchOptions,
        headers,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

// ── Media ────────────────────────────────────────────────────────────────────

export async function createMedia(
    data: MediaCreate,
    token: string
): Promise<MediaItem> {
    return apiFetch<MediaItem>("/media", {
        method: "POST",
        body: JSON.stringify(data),
        token,
    });
}

export async function listMedia(token: string): Promise<MediaItem[]> {
    return apiFetch<MediaItem[]>("/media", { token });
}

export async function updateMedia(
    id: string,
    data: Partial<MediaCreate>,
    token: string
): Promise<MediaItem> {
    return apiFetch<MediaItem>(`/media/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
    });
}

export async function deleteMedia(id: string, token: string): Promise<void> {
    return apiFetch<void>(`/media/${id}`, { method: "DELETE", token });
}

// ── Public profile ────────────────────────────────────────────────────────────

export async function getProfile(username: string): Promise<ProfileResponse> {
    return apiFetch<ProfileResponse>(`/profile/${username}`);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getActivityGrid(
    token: string
): Promise<ActivityGridResponse> {
    return apiFetch<ActivityGridResponse>("/stats/activity-grid", { token });
}

export async function getStreak(token: string): Promise<StreakResponse> {
    return apiFetch<StreakResponse>("/stats/streak", { token });
}

export async function getFingerprint(
    token: string
): Promise<{ fingerprint: FingerprintItem[] }> {
    return apiFetch<{ fingerprint: FingerprintItem[] }>("/stats/fingerprint", {
        token,
    });
}
