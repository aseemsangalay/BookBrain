"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LogForm from "@/components/LogForm";
import MediaCard from "@/components/MediaCard";
import { MediaItem } from "@/lib/types";

export default function LogPage() {
    const [recent, setRecent] = useState<MediaItem | null>(null);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-bg pt-20 pb-16">
                <div className="max-w-2xl mx-auto px-6 pt-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-px bg-accent" />
                            <span className="text-label font-mono text-accent uppercase tracking-widest">
                                New Entry
                            </span>
                        </div>
                        <h1 className="font-serif text-h1 text-ink mb-2">Log Media</h1>
                        <p className="font-body text-body text-muted-light">
                            AI will automatically generate an insight after you submit.
                        </p>
                    </div>

                    <div className="divider mb-8" />

                    {/* Form card */}
                    <div className="card mb-10">
                        <LogForm onSuccess={(item) => setRecent(item)} />
                    </div>

                    {/* Recently logged card */}
                    {recent && (
                        <div className="animate-slide-up">
                            <h2 className="font-serif text-h3 text-ink mb-4">
                                Just logged
                            </h2>
                            <MediaCard item={recent} />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
