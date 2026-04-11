import { TicketsClient } from "./tickets-client";

interface TicketsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function TicketsPage({ params }: TicketsPageProps) {
  const { eventId } = await params;

  return <TicketsClient eventId={eventId} />;
}
