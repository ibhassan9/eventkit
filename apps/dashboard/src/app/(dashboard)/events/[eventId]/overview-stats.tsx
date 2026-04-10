import { formatCurrency } from "@eventkit/lib/utils";

interface EventOverviewStatsProps {
  totalAttendees: number;
  totalRevenue: number;
  checkInRate: number;
  ticketsRemaining: number | null;
  currency: string;
}

export function EventOverviewStats({
  totalAttendees,
  totalRevenue,
  checkInRate,
  ticketsRemaining,
  currency,
}: EventOverviewStatsProps) {
  const stats = [
    {
      label: "Total Registered",
      value: totalAttendees.toLocaleString(),
      context: null,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue, currency),
      context: null,
    },
    {
      label: "Check-in Rate",
      value: `${checkInRate}%`,
      context: `of ${totalAttendees} attendees`,
    },
    {
      label: "Tickets Remaining",
      value: ticketsRemaining !== null ? ticketsRemaining.toLocaleString() : "Unlimited",
      context: ticketsRemaining !== null ? "of total capacity" : null,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
