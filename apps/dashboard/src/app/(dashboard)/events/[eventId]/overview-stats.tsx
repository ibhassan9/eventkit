import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@eventkit/ui/card";
import { Users, DollarSign, ClipboardCheck, TicketIcon } from "lucide-react";
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
      icon: Users,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue, currency),
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      label: "Check-in Rate",
      value: `${checkInRate}%`,
      icon: ClipboardCheck,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      label: "Tickets Remaining",
      value: ticketsRemaining !== null ? ticketsRemaining.toLocaleString() : "Unlimited",
      icon: TicketIcon,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center gap-3 pb-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
