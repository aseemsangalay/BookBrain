export type MediaType =
    | "book"
    | "article"
    | "podcast"
    | "video"
    | "paper"
    | "newsletter";

export type MediaStatus = "read" | "reading" | "want";

export interface MediaItem {
    id: string;
    user_id: string;
    type: MediaType;
    title: string;
    author?: string;
    url?: string;
    cover_url?: string;
    status: MediaStatus;
    rating?: number;
    date_completed?: string;
    ai_insight?: string;
    source_metadata?: Record<string, unknown>;
    created_at: string;
}

export interface MediaCreate {
    type: MediaType;
    title: string;
    author?: string;
    url?: string;
    cover_url?: string;
    status: MediaStatus;
    rating?: number;
    date_completed?: string;
    source_metadata?: Record<string, unknown>;
}

export interface UserProfile {
    id: string;
    clerk_id: string;
    username: string;
    bio?: string;
    avatar_url?: string;
    created_at: string;
}

export interface ProfileResponse {
    profile: UserProfile;
    stats: {
        total: number;
        books: number;
        articles: number;
        podcasts: number;
        videos: number;
        papers: number;
        newsletters: number;
    };
    recent_media: MediaItem[];
    fingerprint: Array<{ theme: string; count: number; pct: number }>;
    activity_grid_weeks: ActivityDay[][];
    current_streak: number;
    longest_streak: number;
}

export interface ActivityDay {
    date: string;
    count: number;
}

export interface ActivityGridResponse {
    weeks: ActivityDay[][];
}

export interface StreakResponse {
    current_streak: number;
    longest_streak: number;
}

export interface FingerprintItem {
    theme: string;
    count: number;
    pct: number;
}

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
    book: "Book",
    article: "Article",
    podcast: "Podcast",
    video: "Video",
    paper: "Paper",
    newsletter: "Newsletter",
};

export const MEDIA_STATUS_LABELS: Record<MediaStatus, string> = {
    read: "Read",
    reading: "Reading",
    want: "Want to Read",
};
