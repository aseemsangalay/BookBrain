"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import MediaCard from "@/components/MediaCard";
import ActivityGrid from "@/components/ActivityGrid";
import FingerprintChart from "@/components/FingerprintChart";
import { listMedia, getActivityGrid, getStreak, getFingerprint, deleteMedia } from "@/lib/api";
import { MediaItem, ActivityDay, StreakResponse, FingerprintItem } from "@/lib/types";
import { Flame, BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [weeks, setWeeks] = useState<ActivityDay[][]>([]);
    const [streak, setStreak] = useState<StreakResponse>({ current_streak: 0, longest_streak: 0 });
    const [fingerprint, setFingerprint] = useState<FingerprintItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            router.push("/sign-in");
            return;
        }
        loadAll();
    }, [isLoaded, isSignedIn]);

    async function loadAll() {
        try {
            const token = await getToken();
            if (!token) return;
            const [m, grid, s, fp] = await Promise.all([
                listMedia(token),
                getActivityGrid(token),
                getStreak(token),
                getFingerprint(token),
            ]);
            setMedia(m);
            setWeeks(grid.weeks);
            setStreak(s);
            setFingerprint(fp.fingerprint);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        const token = await getToken();
        if (!token) return;
        try {
            await deleteMedia(id, token);
            setMedia((prev) => prev.filter((m) => m.id !== id));
        } catch (e) {
            console.error(e);
        }
    }

    if (!isLoaded || loading) {
        return (
            <main className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    const statsCounts = {
        total: media.length,
        books: media.filter((m) => m.type === "book").length,
        articles: media.filter((m) => m.type === "article").length,
        read: media.filter((m) => m.status === "read").length,
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-bg pt-20 pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10 pt-6">
                        <div>
                            <h1 className="font-serif text-h1 text-ink mb-1">Dashboard</h1>
                            <p className="font-body text-body text-muted-light">
                                Your reading universe at a glance.
                            </p>
                        </div>
                        <Link href="/log" className="btn-primary" id="dashboard-log-btn">
                            <Plus size={14} />
                            Log Entry
                        </Link>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: "Total Logged", value: statsCounts.total },
                            { label: "Books", value: statsCounts.books },
                            { label: "Articles", value: statsCounts.articles },
                            { label: "Completed", value: statsCounts.read },
                        ].map(({ label, value }) => (
                            <div key={label} className="card flex flex-col">
                                <span className="text-label font-mono text-muted uppercase tracking-widest mb-1">
                                    {label}
                                </span>
                                <span className="font-serif text-h2 text-ink">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Streak */}
                    <div className="card mb-6 flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-3">
                            <Flame size={20} className="text-accent" />
                            <div>
                                <p className="text-label font-mono text-muted uppercase tracking-widest">
                                    Current Streak
                                </p>
                                <p className="font-serif text-h2 text-ink">
                                    {streak.current_streak}{" "}
                                    <span className="text-muted-light text-h3">days</span>
                                </p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-border hidden sm:block" />
                        <div>
                            <p className="text-label font-mono text-muted uppercase tracking-widest">
                                Longest Streak
                            </p>
                            <p className="font-serif text-h2 text-ink">
                                {streak.longest_streak}{" "}
                                <span className="text-muted-light text-h3">days</span>
                            </p>
                        </div>
                    </div>

                    {/* Activity grid */}
                    <div className="card mb-10">
                        <h2 className="font-serif text-h3 text-ink mb-5">Activity</h2>
                        <ActivityGrid weeks={weeks} />
                    </div>

                    {/* Two-col: media list + fingerprint */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Media list */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-serif text-h3 text-ink">
                                    <BookOpen size={16} className="inline mr-2 text-accent" />
                                    Library
                                </h2>
                            </div>
                            {media.length === 0 ? (
                                <div className="card text-center py-12">
                                    <p className="font-body text-body text-muted-light mb-4">
                                        Nothing logged yet.
                                    </p>
                                    <Link href="/log" className="btn-primary inline-flex">
                                        Log your first entry
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {media.map((item) => (
                                        <MediaCard
                                            key={item.id}
                                            item={item}
                                            showActions
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fingerprint */}
                        <div>
                            <h2 className="font-serif text-h3 text-ink mb-4">
                                Fingerprint
                            </h2>
                            <div className="card">
                                <FingerprintChart data={fingerprint} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
