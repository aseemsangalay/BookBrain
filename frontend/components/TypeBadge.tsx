"use client";

import { MediaType } from "@/lib/types";

const TYPE_COLORS: Record<MediaType, string> = {
    book: "bg-amber-950/60 text-amber-300 border border-amber-900/40",
    article: "bg-sky-950/60 text-sky-300 border border-sky-900/40",
    podcast: "bg-purple-950/60 text-purple-300 border border-purple-900/40",
    video: "bg-rose-950/60 text-rose-300 border border-rose-900/40",
    paper: "bg-emerald-950/60 text-emerald-300 border border-emerald-900/40",
    newsletter: "bg-orange-950/60 text-orange-300 border border-orange-900/40",
};

export default function TypeBadge({ type }: { type: MediaType }) {
    return (
        <span className={`badge ${TYPE_COLORS[type]}`}>{type}</span>
    );
}
