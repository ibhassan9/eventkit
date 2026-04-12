"use client";

import { Loader2, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { formatDateRange } from "@eventkit/lib/utils";
import { useEventWithStats, useCompleteEvent } from "@/hooks/use-events";
import { EventOverviewStats } from "./overview-stats";
import { EventOverviewActions } from "./overview-actions";
import { RecentAttendees } from "./recent-attendees";
import { RevenueByTicket } from "./revenue-by-ticket";

interface EventOverviewClientProps {
  eventId: string;
}

export function EventOverviewClient({ eventId }: EventOverviewClientProps) {
  const { data: event, isLoading, error } = useEventWithStats(eventId);
  const completeEvent = useCompleteEvent();

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

  const isPastEvent =
    event.status === "published" && new Date(event.endDate) < new Date();

  async function handleMarkCompleted() {
    if (!event) return;
    const result = await completeEvent.mutateAsync({ eventId: event.id });
    if (result.success) {
      toast.success("Event marked as completed");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {event.status === "cancelled" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle className="h-4 w-4 shrink-0" />
          This event has been cancelled
        </div>
      )}
      {event.status === "completed" && (
        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
          <CheckCircle className="h-4 w-4 shrink-0" />
          This event is completed
        </div>
      )}
      {isPastEvent && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            This event ended on{" "}
            {formatDateRange(event.endDate, event.endDate, event.timezone)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkCompleted}
            disabled={completeEvent.isPending}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            Mark as Completed
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-stone-400">
            {process.env.NEXT_PUBLIC_EVENT_URL ?? "http://localhost:3002"}/{event.slug}
          </p>
        </div>
        <EventOverviewActions
          eventSlug={event.slug}
          eventId={event.id}
          eventStatus={event.status}
          eventEndDate={event.endDate}
          eventName={event.name}
          attendeeCount={event.totalAttendees}
        />
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
