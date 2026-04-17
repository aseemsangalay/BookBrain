"use client";

import { MediaItem } from "@/lib/types";
import TypeBadge from "./TypeBadge";
import { Star, Trash2 } from "lucide-react";

interface MediaCardProps {
    item: MediaItem;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export default function MediaCard({
    item,
    onDelete,
    showActions = false,
}: MediaCardProps) {
    const stars = item.rating ? Array.from({ length: 5 }) : null;

    return (
        <article className="card group animate-fade-in">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Type + Status row */}
                    <div className="flex items-center gap-2 mb-2.5">
                        <TypeBadge type={item.type} />
                        <span className="text-label font-mono text-muted uppercase tracking-widest">
                            {item.status}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-h3 text-ink leading-snug mb-1 truncate">
                        {item.title}
                    </h3>

                    {/* Author */}
                    {item.author && (
                        <p className="text-body text-muted-light font-body mb-3">
                            {item.author}
                        </p>
                    )}

                    {/* Stars */}
                    {stars && (
                        <div className="flex items-center gap-0.5 mb-3">
                            {stars.map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className={
                                        i < (item.rating || 0)
                                            ? "text-accent fill-accent"
                                            : "text-border-light"
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* AI Insight */}
                    {item.ai_insight && (
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-body text-muted-light font-body italic leading-relaxed">
                                <span className="text-accent not-italic font-mono text-label mr-2">
                                    AI →
                                </span>
                                {item.ai_insight}
                            </p>
                        </div>
                    )}
                </div>

                {/* Delete action */}
                {showActions && onDelete && (
                    <button
                        onClick={() => onDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded text-muted hover:text-red-400"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Date */}
            {item.date_completed && (
                <p className="mt-3 text-label font-mono text-muted">
                    {new Date(item.date_completed).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            )}
        </article>
    );
}
