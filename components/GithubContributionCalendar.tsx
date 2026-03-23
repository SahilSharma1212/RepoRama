'use client'

type CalendarDay = {
    date: string;
    count: number;
    weekday: number;
    weekIndex: number;
};

type Props = {
    calendarDays: CalendarDay[];
};

const levels = [
    { threshold: 0, className: "bg-zinc-800/60" },
    { threshold: 1, className: "bg-[#0e4429]" },
    { threshold: 3, className: "bg-[#006d32]" },
    { threshold: 6, className: "bg-[#26a641]" },
    { threshold: 10, className: "bg-[#39d353]" },
];

function getLevelClass(count: number) {
    let chosen = levels[0].className;
    for (const level of levels) {
        if (count >= level.threshold) {
            chosen = level.className;
        } else {
            break;
        }
    }
    return chosen;
}

export default function GithubContributionCalendar({ calendarDays }: Props) {
    if (!calendarDays || calendarDays.length === 0) {
        return (
            <div className="text-xs text-gray-500">
                No contribution data available.
            </div>
        );
    }

    const weeksCount = Math.max(...calendarDays.map((d) => d.weekIndex)) + 1;
    const matrix: (CalendarDay | null)[][] = Array.from({ length: weeksCount }, () =>
        Array.from({ length: 7 }, () => null)
    );

    calendarDays.forEach((day) => {
        if (day.weekIndex >= 0 && day.weekIndex < weeksCount && day.weekday >= 0 && day.weekday < 7) {
            matrix[day.weekIndex][day.weekday] = day;
        }
    });

    const weekdayLabels = ["Mon", "Wed", "Fri"];

    return (
        <div className="inline-flex gap-3">
            <div className="flex flex-col justify-between py-1 pr-1 text-[10px] text-gray-500">
                {Array.from({ length: 7 }).map((_, idx) => {
                    const label = weekdayLabels.find((_, i) => i * 2 + 1 === idx);
                    return (
                        <div key={idx} className="h-3.5 flex items-center">
                            {label ?? ""}
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-[3px]">
                {matrix.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                        {week.map((day, dayIndex) => {
                            const count = day?.count ?? 0;
                            const title = day
                                ? `${count} contributions on ${new Date(day.date).toDateString()}`
                                : "No contributions";
                            return (
                                <div
                                    key={dayIndex}
                                    className={`h-3.5 w-3.5 rounded-none ${getLevelClass(count)}`}
                                    title={title}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

