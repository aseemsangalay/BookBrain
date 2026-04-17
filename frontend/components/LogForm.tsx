"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { MediaCreate, MediaType, MediaStatus } from "@/lib/types";
import { createMedia } from "@/lib/api";
import { Loader2 } from "lucide-react";
import TypeBadge from "./TypeBadge";

interface LogFormProps {
    onSuccess?: (item: import("@/lib/types").MediaItem) => void;
}

const TYPES: MediaType[] = [
    "book",
    "article",
    "podcast",
    "video",
    "paper",
    "newsletter",
];
const STATUSES: { value: MediaStatus; label: string }[] = [
    { value: "read", label: "Read" },
    { value: "reading", label: "Currently Reading" },
    { value: "want", label: "Want to Read" },
];

export default function LogForm({ onSuccess }: LogFormProps) {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState<MediaCreate>({
        type: "book",
        title: "",
        author: "",
        url: "",
        status: "read",
        rating: undefined,
        date_completed: "",
    });

    const set = (field: keyof MediaCreate, value: MediaCreate[keyof MediaCreate]) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSuccess(false);

        try {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            const payload: MediaCreate = {
                ...form,
                author: form.author || undefined,
                url: form.url || undefined,
                date_completed: form.date_completed || undefined,
                rating: form.rating ? Number(form.rating) : undefined,
            };

            const item = await createMedia(payload, token);
            setSuccess(true);
            setForm({
                type: "book",
                title: "",
                author: "",
                url: "",
                status: "read",
                rating: undefined,
                date_completed: "",
            });
            onSuccess?.(item);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector */}
            <div>
                <label className="block text-label font-mono text-muted uppercase tracking-widest mb-3">
                    Type
                </label>
                <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => set("type", t)}
                            className={`badge transition-all ${form.type === t
                                ? "ring-1 ring-accent/60 scale-105"
                                : "opacity-50 hover:opacity-80"
                                }`}
                            style={{
                                background:
                                    form.type === t ? undefined : "transparent",
                            }}
                        >
                            <TypeBadge type={t} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <label
                    htmlFor="title"
                    className="block text-label font-mono text-muted uppercase tracking-widest mb-1.5"
                >
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="The Name of the Wind"
                    className="input-base"
                />
            </div>

            {/* Author */}
            <div>
                <label
                    htmlFor="author"
                    className="block text-label font-mono text-muted uppercase tracking-widest mb-1.5"
                >
                    Author / Creator
                </label>
                <input
                    id="author"
                    type="text"
                    value={form.author || ""}
                    onChange={(e) => set("author", e.target.value)}
                    placeholder="Patrick Rothfuss"
                    className="input-base"
                />
            </div>

            {/* URL */}
            <div>
                <label
                    htmlFor="url"
                    className="block text-label font-mono text-muted uppercase tracking-widest mb-1.5"
                >
                    URL (optional)
                </label>
                <input
                    id="url"
                    type="url"
                    value={form.url || ""}
                    onChange={(e) => set("url", e.target.value)}
                    placeholder="https://..."
                    className="input-base"
                />
            </div>

            {/* Status + Rating row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="status"
                        className="block text-label font-mono text-muted uppercase tracking-widest mb-1.5"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        value={form.status}
                        onChange={(e) => set("status", e.target.value as MediaStatus)}
                        className="input-base"
                    >
                        {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="rating"
                        className="block text-label font-mono text-muted uppercase tracking-widest mb-1.5"
                    >
                        Rating
                    </label>
                    <select
                        id="rating"
                        value={form.rating ?? ""}
                        onChange={(e) =>
                            set("rating", e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="input-base"
                    >
                        <option value="">No rating</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {"★".repeat(n)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Date */}
            <div>
                <label
                    htmlFor="date_completed"
                    className="block text-label font-mono text-muted uppercase tracking-widest mb-1.5"
                >
                    Date Completed
                </label>
                <input
                    id="date_completed"
                    type="date"
                    value={form.date_completed || ""}
                    onChange={(e) => set("date_completed", e.target.value)}
                    className="input-base"
                />
            </div>

            {/* Error / Success */}
            {error && (
                <p className="text-red-400 text-body font-body bg-red-950/30 border border-red-900/30 rounded-sm px-3 py-2">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-emerald-400 text-body font-body bg-emerald-950/30 border border-emerald-900/30 rounded-sm px-3 py-2">
                    Entry logged. Generating your insight…
                </p>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
                id="log-form-submit"
            >
                {loading ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
                        Logging…
                    </>
                ) : (
                    "Log Entry"
                )}
            </button>
        </form>
    );
}
