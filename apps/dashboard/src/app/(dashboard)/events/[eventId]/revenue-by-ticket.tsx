import { formatCurrency } from "@eventkit/lib/utils";

interface TicketTypeRevenue {
  name: string;
  soldCount: number;
  revenue: number;
}

interface RevenueByTicketProps {
  ticketTypes: TicketTypeRevenue[];
  currency: string;
}

export function RevenueByTicket({
  ticketTypes,
  currency,
}: RevenueByTicketProps) {
  if (ticketTypes.length === 0) return null;

  const totalSold = ticketTypes.reduce((sum, tt) => sum + tt.soldCount, 0);
  const totalRevenue = ticketTypes.reduce((sum, tt) => sum + tt.revenue, 0);

  return (
    <div className="rounded-xl border border-stone-200 bg-white">
      <div className="border-b border-stone-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-stone-900">
          Revenue by Ticket
        </h3>
      </div>
      <div className="divide-y divide-stone-100">
        {ticketTypes.map((tt) => (
          <div
            key={tt.name}
            className="flex items-center justify-between px-5 py-3"
          >
            <span className="text-sm text-stone-700">{tt.name}</span>
            <div className="flex items-center gap-6">
              <span className="text-xs text-stone-400">
                {tt.soldCount} sold
              </span>
              <span className="text-sm font-medium text-stone-900 tabular-nums">
                {formatCurrency(tt.revenue, currency)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3">
        <span className="text-sm font-semibold text-stone-900">Total</span>
        <div className="flex items-center gap-6">
          <span className="text-xs text-stone-400">{totalSold} sold</span>
          <span className="text-sm font-semibold text-stone-900 tabular-nums">
            {formatCurrency(totalRevenue, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
