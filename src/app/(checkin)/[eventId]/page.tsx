import { getEventById } from "@/db/queries";
import { notFound } from "next/navigation";
import { CheckinPageClient } from "./checkin-page-client";

interface CheckinPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  return (
    <CheckinPageClient eventId={eventId} eventName={event.name} />
  );
}
