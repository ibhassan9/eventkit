import { AttendeesClient } from "./attendees-client";

interface AttendeesPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function AttendeesPage({ params }: AttendeesPageProps) {
  const { eventId } = await params;

  return <AttendeesClient eventId={eventId} />;
}
