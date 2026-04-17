import { notFound } from "next/navigation";
import { getProfile } from "@/lib/api";
import { ProfileResponse } from "@/lib/types";
import ActivityGrid from "@/components/ActivityGrid";
import FingerprintChart from "@/components/FingerprintChart";
import MediaCard from "@/components/MediaCard";
import Navbar from "@/components/Navbar";
import { BookOpen, Headphones, FileText, Flame, Trophy } from "lucide-react";
import type { Metadata } from "next";

interface Props {
    params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `${params.username} on BrainLog`,
        description: `${params.username}'s public reading profile on BrainLog.`,
    };
}

async function fetchProfile(username: string): Promise<ProfileResponse | null> {
    try {
        return await getProfile(username);
    } catch {
        return null;
    }
}

// Stats grid helper
function StatBlock({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: number;
}) {
    return (
        <div className="flex flex-col items-center gap-1 p-4 border border-[#1E1E1E] rounded-sm bg-[#141414]">
            <Icon size={16} className="text-[#E8D5A3] mb-1" />
            <span className="font-serif text-2xl text-[#F2EDE4] leading-none">
                {value}
            </span>
            <span className="text-[0.65rem] font-mono text-[#6B6B6B] uppercase tracking-widest">
                {label}
            </span>
        </div>
    );
}
export default async function PublicProfilePage({ params }: Props) {
    const data = await fetchProfile(params.username);

    if (!data) {
        notFound();
    }

    const { profile, stats, recent_media, fingerprint, activity_grid_weeks, current_streak } = data;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#0D0D0D] pt-20 pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    {/* ── Profile header ─────────────────────────────────────────── */}
                    <section className="pt-10 pb-8 border-b border-[#1E1E1E]">
                        <div className="flex items-start gap-6 flex-wrap">
                            {/* Avatar */}
                            {profile.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.username}
                                    className="w-16 h-16 rounded-full object-cover border border-[#2A2A2A]"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center">
                                    <span className="font-serif text-2xl text-[#E8D5A3]">
                                        {profile.username[0].toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* Name / bio */}
                            <div className="flex-1 min-w-0">
                                <h1 className="font-serif text-[2.25rem] text-[#F2EDE4] leading-tight mb-1">
                                    {profile.username}
                                </h1>
                                {profile.bio && (
                                    <p className="font-body text-[1.125rem] text-[#888888] max-w-lg leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )}
                                <p className="text-[0.7rem] font-mono text-[#6B6B6B] mt-2 uppercase tracking-widest">
                                    Member since{" "}
                                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── Stats row ──────────────────────────────────────────────── */}
                    <section className="py-8 border-b border-[#1E1E1E]">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            <StatBlock icon={BookOpen} label="Books" value={stats.books} />
                            <StatBlock icon={FileText} label="Articles" value={stats.articles} />
                            <StatBlock icon={Headphones} label="Podcasts" value={stats.podcasts} />
                            <StatBlock icon={FileText} label="Videos" value={stats.videos} />
                            <StatBlock icon={FileText} label="Papers" value={stats.papers} />
                            <StatBlock icon={FileText} label="Newsletters" value={stats.newsletters} />
                        </div>
                    </section>

                    {/* ── Two-column body ────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                        {/* Left col — media + fingerprint */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Activity Grid */}
                            <div>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-4 h-px bg-[#E8D5A3]" />
                                    <h2 className="font-serif text-[1.25rem] text-[#F2EDE4]">
                                        Activity
                                    </h2>
                                </div>
                                <div className="bg-[#141414] border border-[#1E1E1E] rounded-sm p-5 overflow-x-auto">
                                    <ActivityGrid weeks={activity_grid_weeks} />
                                </div>
                            </div>

                            {/* Recent media */}
                            <div>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-4 h-px bg-[#E8D5A3]" />
                                    <h2 className="font-serif text-[1.25rem] text-[#F2EDE4]">
                                        Recently Read
                                    </h2>
                                </div>
                                {recent_media.length === 0 ? (
                                    <p className="font-body text-[#6B6B6B]">Nothing logged yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recent_media.map((item) => (
                                            <MediaCard key={item.id} item={item} showActions={false} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right col — streak + fingerprint */}
                        <div className="space-y-6">
                            {/* Streak card */}
                            <div className="bg-[#141414] border border-[#1E1E1E] rounded-sm p-5">
                                <div className="flex items-center gap-2 mb-5">
                                    <Flame size={16} className="text-[#E8D5A3]" />
                                    <h2 className="font-serif text-[1.25rem] text-[#F2EDE4]">
                                        Streak
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[0.65rem] font-mono text-[#6B6B6B] uppercase tracking-widest mb-1">
                                            Current
                                        </p>
                                        <p className="font-serif text-3xl text-[#F2EDE4]">
                                            {current_streak}{" "}
                                            <span className="text-[#6B6B6B] text-lg">days</span>
                                        </p>
                                    </div>
                                    <div className="w-full h-px bg-[#1E1E1E]" />
                                    <div>
                                        <p className="text-[0.65rem] font-mono text-[#6B6B6B] uppercase tracking-widest mb-1">
                                            Total entries
                                        </p>
                                        <p className="font-serif text-3xl text-[#F2EDE4]">
                                            {stats.total}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Fingerprint */}
                            <div className="bg-[#141414] border border-[#1E1E1E] rounded-sm p-5">
                                <div className="flex items-center gap-2 mb-5">
                                    <Trophy size={16} className="text-[#E8D5A3]" />
                                    <h2 className="font-serif text-[1.25rem] text-[#F2EDE4]">
                                        Intellectual Fingerprint
                                    </h2>
                                </div>
                                <FingerprintChart data={fingerprint} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
