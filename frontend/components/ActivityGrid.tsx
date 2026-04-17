"use client";

import { ActivityDay } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface ActivityGridProps {
    weeks: ActivityDay[][];
}

function getCellClass(count: number): string {
    if (count === 0) return "grid-cell grid-cell-0";
    if (count === 1) return "grid-cell grid-cell-1";
    if (count === 2) return "grid-cell grid-cell-2";
    if (count === 3) return "grid-cell grid-cell-3";
    return "grid-cell grid-cell-4";
}

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

export default function ActivityGrid({ weeks }: ActivityGridProps) {
    if (!weeks || weeks.length === 0) {
        return (
            <div className="text-muted text-label font-mono">No activity yet.</div>
        );
    }

    // Month labels — find first day of each month
    const monthLabels: { label: string; colIndex: number }[] = [];
    weeks.forEach((week, wi) => {
        week.forEach((day) => {
            try {
                const d = parseISO(day.date);
                if (d.getDate() <= 7 && wi > 0) {
                    const existing = monthLabels.find((m) => m.colIndex === wi);
                    if (!existing) {
                        monthLabels.push({ label: format(d, "MMM"), colIndex: wi });
                    }
                }
            } catch { }
        });
    });

    return (
        <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-1 min-w-0">
                {/* Month labels */}
                <div className="flex gap-1 mb-1 ml-8">
                    {weeks.map((_, wi) => {
                        const label = monthLabels.find((m) => m.colIndex === wi);
                        return (
                            <div key={wi} className="w-3 text-center">
                                {label && (
                                    <span className="text-[9px] font-mono text-muted">
                                        {label.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Grid rows (by day of week) */}
                {DAY_LABELS.map((dayLabel, di) => (
                    <div key={di} className="flex items-center gap-1">
                        {/* Day label */}
                        <span className="w-7 text-right text-[9px] font-mono text-muted pr-1 shrink-0">
                            {dayLabel}
                        </span>
                        {/* Cells */}
                        {weeks.map((week, wi) => {
                            const day = week[di];
                            if (!day) {
                                return <div key={wi} className="w-3 h-3" />;
                            }
                            return (
                                <div
                                    key={wi}
                                    className={getCellClass(day.count)}
                                    title={`${day.date}: ${day.count} item${day.count !== 1 ? "s" : ""}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 ml-8">
                <span className="text-[9px] font-mono text-muted">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`grid-cell grid-cell-${level}`}
                    />
                ))}
                <span className="text-[9px] font-mono text-muted">More</span>
            </div>
        </div>
    );
}
