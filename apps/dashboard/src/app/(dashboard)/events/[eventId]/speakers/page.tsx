import { SpeakersClient } from "./speakers-client";

interface SpeakersPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function SpeakersPage({ params }: SpeakersPageProps) {
  const { eventId } = await params;

  return <SpeakersClient eventId={eventId} />;
}
