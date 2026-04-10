"use client";

import { Button } from "@eventkit/ui/button";
import { X } from "lucide-react";

interface TicketType {
  id: string;
  name: string;
}

interface AttendeeFiltersProps {
  ticketTypes: TicketType[];
  filters: {
    search: string;
    status: string;
    ticketType: string;
    checkedIn: string;
  };
  onFilterChange: (updates: Record<string, string>) => void;
}

const paymentStatuses = [
  { value: "paid", label: "Paid" },
  { value: "free", label: "Free" },
  { value: "pending", label: "Pending" },
  { value: "refunded", label: "Refunded" },
];

const checkedInOptions = [
  { value: "true", label: "Checked In" },
  { value: "false", label: "Not Checked In" },
];

export function AttendeeFilters({
  ticketTypes,
  filters,
  onFilterChange,
}: AttendeeFiltersProps) {
  const hasFilters = filters.status || filters.ticketType || filters.checkedIn;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Filter:</span>

      {paymentStatuses.map((s) => (
        <Button
          key={s.value}
          variant={filters.status === s.value ? "default" : "outline"}
          size="xs"
          onClick={() =>
            onFilterChange({
              status: filters.status === s.value ? "" : s.value,
            })
          }
        >
          {s.label}
        </Button>
      ))}

      {ticketTypes.map((tt) => (
        <Button
          key={tt.id}
          variant={filters.ticketType === tt.id ? "default" : "outline"}
          size="xs"
          onClick={() =>
            onFilterChange({
              ticketType: filters.ticketType === tt.id ? "" : tt.id,
            })
          }
        >
          {tt.name}
        </Button>
      ))}

      {checkedInOptions.map((opt) => (
        <Button
          key={opt.value}
          variant={filters.checkedIn === opt.value ? "default" : "outline"}
          size="xs"
          onClick={() =>
            onFilterChange({
              checkedIn: filters.checkedIn === opt.value ? "" : opt.value,
            })
          }
        >
          {opt.label}
        </Button>
      ))}

      {hasFilters && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() =>
            onFilterChange({ status: "", ticketType: "", checkedIn: "" })
          }
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
