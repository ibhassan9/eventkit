"use client";

import { Tag } from "lucide-react";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";

interface TicketEmptyStateProps {
  onCreate: () => void;
}

export function TicketEmptyState({ onCreate }: TicketEmptyStateProps) {
  return (
    <DataTableEmptyState
      icon={Tag}
      title="No tickets yet"
      description="Create ticket types with pricing for your event. Attendees select a ticket when they register."
      actionLabel="Create Your First Ticket"
      onAction={onCreate}
    />
  );
}
