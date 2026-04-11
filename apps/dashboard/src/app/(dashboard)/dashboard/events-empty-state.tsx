"use client";

import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";

export function EventsEmptyState() {
  const router = useRouter();
  return (
    <DataTableEmptyState
      icon={CalendarDays}
      title="No events yet"
      description="Create your first event to start managing registrations, tickets, and attendees."
      actionLabel="Create Your First Event"
      onAction={() => router.push("/events/new")}
    />
  );
}
