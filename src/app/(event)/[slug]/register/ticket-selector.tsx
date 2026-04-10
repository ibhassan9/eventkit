"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  selectedId: string;
  onSelect: (id: string) => void;
  currency: string;
  secondaryColor: string;
}

export function TicketSelector({
  ticketTypes,
  selectedId,
  onSelect,
  currency,
  secondaryColor,
}: TicketSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900">Select a Ticket</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ticketTypes.map((ticket) => {
          const isSelected = ticket.id === selectedId;
          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSelect(ticket.id)}
              className={cn(
                "relative rounded-xl border-2 bg-white p-5 text-left transition-all",
                isSelected
                  ? "shadow-md"
                  : "border-zinc-200 hover:border-zinc-300"
              )}
              style={isSelected ? { borderColor: secondaryColor } : undefined}
            >
              {isSelected && (
                <div
                  className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <Check className="size-3" />
                </div>
              )}
              <p className="font-semibold text-zinc-900">{ticket.name}</p>
              {ticket.description && (
                <p className="mt-1 text-xs text-zinc-500">
                  {ticket.description}
                </p>
              )}
              <p
                className="mt-2 text-lg font-bold"
                style={{ color: isSelected ? secondaryColor : undefined }}
              >
                {ticket.price === 0
                  ? "Free"
                  : formatCurrency(ticket.price, currency)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
