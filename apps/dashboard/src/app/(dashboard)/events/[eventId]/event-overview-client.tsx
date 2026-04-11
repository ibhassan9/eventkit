"use client";

import { Loader2 } from "lucide-react";
import { useEventWithStats } from "@/hooks/use-events";
import { EventOverviewStats } from "./overview-stats";
import { EventOverviewActions } from "./overview-actions";
import { RecentAttendees } from "./recent-attendees";
import { RevenueByTicket } from "./revenue-by-ticket";

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

  const checkInRate =
    event.totalAttendees > 0
      ? Math.round((event.checkedIn / event.totalAttendees) * 100)
      : 0;

  const ticketsSold = event.ticketsSold ?? 0;

  const ticketTypeRevenue = event.ticketTypes.map((tt) => ({
    name: tt.name,
    soldCount: tt.soldCount,
    revenue: tt.soldCount * tt.price,
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-stone-400">
            {process.env.NEXT_PUBLIC_EVENT_URL ?? "http://localhost:3002"}/{event.slug}
          </p>
        </div>
        <EventOverviewActions eventSlug={event.slug} eventId={event.id} />
      </div>

      <EventOverviewStats
        totalAttendees={event.totalAttendees}
        totalRevenue={event.totalRevenue}
        ticketsSold={ticketsSold}
        checkInRate={checkInRate}
        currency={event.currency}
      />

      {ticketTypeRevenue.length > 0 && (
        <RevenueByTicket
          ticketTypes={ticketTypeRevenue}
          currency={event.currency}
        />
      )}

      <RecentAttendees
        attendees={event.attendees.slice(0, 5)}
        eventId={event.id}
      />
    </div>
  );
}
