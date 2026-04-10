"use client";

interface StatsCardsProps {
  total: number;
  checkedIn: number;
  remaining: number;
}

export function StatsCards({ total, checkedIn, remaining }: StatsCardsProps) {
  const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const stats = [
    {
      label: "Total Attendees",
      value: total,
      context: null,
    },
    {
      label: "Checked In",
      value: checkedIn,
      context: `${percentage}% of total`,
    },
    {
      label: "Remaining",
      value: remaining,
      context: null,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            {stat.label}
          </p>
          <p className="mt-1 text-[28px] font-semibold text-stone-900">
            {stat.value}
          </p>
          {stat.context && (
            <p className="mt-0.5 text-xs text-stone-400">{stat.context}</p>
          )}
        </div>
      ))}
    </div>
  );
}
