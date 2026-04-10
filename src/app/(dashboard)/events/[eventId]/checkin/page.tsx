import { getEventById, getCheckinStats, getAttendeesByEventId } from "@/db/queries";
import { notFound } from "next/navigation";
import { CheckinDashboardClient } from "./checkin-dashboard-client";

interface CheckinDashboardPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function CheckinDashboardPage({
  params,
}: CheckinDashboardPageProps) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  const stats = await getCheckinStats(eventId);
  const recentAttendees = await getAttendeesByEventId(eventId, {
    checkedIn: true,
    limit: 10,
  });

  const recentCheckins = recentAttendees.map((a) => ({
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    email: a.email,
    checkedInAt: a.checkedInAt?.toISOString() ?? null,
  }));

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Check-in Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor check-in activity for {event.name}.
        </p>
      </div>
      <CheckinDashboardClient
        eventId={eventId}
        eventSlug={event.slug}
        initialStats={stats}
        initialRecentCheckins={recentCheckins}
      />
    </div>
  );
}
