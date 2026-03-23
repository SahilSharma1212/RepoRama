'use client'

type HourlyBucket = {
    hour: number;
    count: number;
};

type Props = {
    hourlyHistogram: HourlyBucket[];
};

const colorLevels = [
    { threshold: 0, className: "bg-zinc-800/60" },
    { threshold: 1, className: "bg-[#0e4429]" },
    { threshold: 3, className: "bg-[#006d32]" },
    { threshold: 6, className: "bg-[#26a641]" },
    { threshold: 10, className: "bg-[#39d353]" },
];

function getColorClass(count: number) {
    let chosen = colorLevels[0].className;
    for (const level of colorLevels) {
        if (count >= level.threshold) {
            chosen = level.className;
        } else {
            break;
        }
    }
    return chosen;
}

export default function CommitTimeOfDayHeatmap({ hourlyHistogram }: Props) {
    if (!hourlyHistogram || hourlyHistogram.length === 0) {
        return (
            <div className="text-xs text-gray-500">
                No commit time data available.
            </div>
        );
    }

    const buckets = [...hourlyHistogram].sort((a, b) => a.hour - b.hour);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto">
                {buckets.map((bucket) => (
                    <div
                        key={bucket.hour}
                        className={`h-8 min-w-[14px] rounded-none ${getColorClass(bucket.count)}`}
                        title={`${bucket.count} commits around ${bucket.hour}:00`}
                    />
                ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
                <span>18h</span>
                <span>24h</span>
            </div>
        </div>
    );
}

