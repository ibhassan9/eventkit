import { EventOverviewClient } from "./event-overview-client";

export default async function EventOverviewPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return <EventOverviewClient eventId={eventId} />;
}
