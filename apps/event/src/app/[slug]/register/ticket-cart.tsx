"use client";

import { formatCurrency } from "@eventkit/lib/utils";
import { QuantityStepper } from "./quantity-stepper";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number | null;
  soldCount: number;
  salesStart: Date | null;
  salesEnd: Date | null;
  isVisible: boolean;
  allowWaitlist: boolean;
  minPerOrder: number;
  maxPerOrder: number;
}

interface TicketCartProps {
  ticketTypes: TicketType[];
  cart: Record<string, number>;
  onCartChange: (ticketTypeId: string, quantity: number) => void;
  currency: string;
  primaryColor: string;
  onJoinWaitlist?: (ticketTypeId: string, ticketTypeName: string) => void;
}

function getTicketAvailability(ticket: TicketType) {
  const now = new Date();
  if (!ticket.isVisible) return { available: false, reason: "hidden" as const };
  if (ticket.salesStart && new Date(ticket.salesStart) > now)
    return { available: false, reason: "not_started" as const };
  if (ticket.salesEnd && new Date(ticket.salesEnd) < now)
    return { available: false, reason: "ended" as const };
  if (ticket.capacity && ticket.soldCount >= ticket.capacity)
    return {
      available: false,
      reason: ticket.allowWaitlist
        ? ("waitlist" as const)
        : ("sold_out" as const),
    };
  return { available: true, reason: "on_sale" as const };
}

export function TicketCart({
  ticketTypes,
  cart,
  onCartChange,
  currency,
  primaryColor,
  onJoinWaitlist,
}: TicketCartProps) {
  const visibleTickets = ticketTypes.filter((t) => {
    if (!t.isVisible) return false;
    const now = new Date();
    if (t.salesEnd && new Date(t.salesEnd) < now) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900">
        Select your tickets
      </h2>
      <div className="space-y-3">
        {visibleTickets.map((ticket) => {
          const { available, reason } = getTicketAvailability(ticket);
          const remaining = ticket.capacity
            ? ticket.capacity - ticket.soldCount
            : null;
          const maxQty = Math.min(
            ticket.maxPerOrder,
            remaining ?? ticket.maxPerOrder
          );
          const currentQty = cart[ticket.id] ?? 0;

          return (
            <div
              key={ticket.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
              style={
                currentQty > 0
                  ? { borderColor: primaryColor }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-zinc-900">
                      {ticket.name}
                    </h3>
                    <p className="ml-4 shrink-0 font-semibold text-zinc-900">
                      {ticket.price === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatCurrency(ticket.price, currency)
                      )}
                    </p>
                  </div>
                  {ticket.description && (
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {ticket.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">
                    {remaining !== null
                      ? `${remaining} remaining`
                      : "∞ available"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end">
                {!available ? (
                  reason === "waitlist" ? (
                    <button
                      type="button"
                      onClick={() =>
                        onJoinWaitlist?.(ticket.id, ticket.name)
                      }
                      className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      Join Waitlist
                    </button>
                  ) : reason === "sold_out" ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Sold Out
                    </span>
                  ) : reason === "not_started" ? (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Coming Soon
                    </span>
                  ) : null
                ) : (
                  <QuantityStepper
                    value={currentQty}
                    min={ticket.minPerOrder}
                    max={maxQty}
                    onChange={(qty) => onCartChange(ticket.id, qty)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
