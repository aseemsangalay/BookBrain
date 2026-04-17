"use client";

import { FingerprintItem } from "@/lib/types";
import TypeBadge from "./TypeBadge";
import { MediaType } from "@/lib/types";

interface FingerprintChartProps {
    data: FingerprintItem[];
}

export default function FingerprintChart({ data }: FingerprintChartProps) {
    if (!data || data.length === 0) {
        return (
            <p className="text-muted text-label font-mono">No data yet.</p>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((item) => (
                <div key={item.theme} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                        <TypeBadge type={item.theme as MediaType} />
                    </div>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${item.pct}%` }}
                        />
                    </div>
                    <span className="text-label font-mono text-muted-light w-8 text-right shrink-0">
                        {item.pct}%
                    </span>
                </div>
            ))}
        </div>
    );
}
