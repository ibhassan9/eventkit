"use client";

import { Loader2 } from "lucide-react";
import { useEventWithStats } from "@/hooks/use-events";
import { EventOverviewStats } from "./overview-stats";
import { EventOverviewActions } from "./overview-actions";
import { RecentAttendees } from "./recent-attendees";

interface EventOverviewClientProps {
  eventId: string;
}

export function EventOverviewClient({ eventId }: EventOverviewClientProps) {
  const { data: event, isLoading, error } = useEventWithStats(eventId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="py-24 text-center text-sm text-destructive">
        Failed to load event. Please try again.
      </div>
    );
  }

  const ticketsRemaining = event.maxAttendees
    ? event.maxAttendees - event.totalAttendees
    : null;

  const checkInRate =
    event.totalAttendees > 0
      ? Math.round((event.checkedIn / event.totalAttendees) * 100)
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-stone-400">Event overview</p>
        </div>
        <EventOverviewActions eventSlug={event.slug} eventId={event.id} />
      </div>

      <EventOverviewStats
        totalAttendees={event.totalAttendees}
        totalRevenue={event.totalRevenue}
        checkInRate={checkInRate}
        ticketsRemaining={ticketsRemaining}
        currency={event.currency}
      />

      <RecentAttendees
        attendees={event.attendees.slice(0, 5)}
        eventId={event.id}
      />
    </div>
  );
}
