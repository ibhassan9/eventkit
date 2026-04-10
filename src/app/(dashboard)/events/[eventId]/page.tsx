import { notFound } from "next/navigation";
import { getEventWithStats } from "@/db/queries";
import { EventOverviewStats } from "./overview-stats";
import { EventOverviewActions } from "./overview-actions";
import { RecentAttendees } from "./recent-attendees";

export default async function EventOverviewPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEventWithStats(eventId);
  if (!event) notFound();

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
          <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
          <p className="text-sm text-muted-foreground">Event overview</p>
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
