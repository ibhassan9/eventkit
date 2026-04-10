import { CheckinDashboardClient } from "./checkin-dashboard-client";

interface CheckinDashboardPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function CheckinDashboardPage({
  params,
}: CheckinDashboardPageProps) {
  const { eventId } = await params;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Check-in Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor check-in activity for your event.
        </p>
      </div>
      <CheckinDashboardClient eventId={eventId} />
    </div>
  );
}
