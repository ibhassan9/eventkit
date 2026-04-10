import { ScheduleClient } from "./schedule-client";

interface SchedulePageProps {
  params: Promise<{ eventId: string }>;
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const { eventId } = await params;

  return <ScheduleClient eventId={eventId} />;
}
