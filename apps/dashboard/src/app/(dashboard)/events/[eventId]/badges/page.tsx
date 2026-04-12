import { BadgesClient } from "./badges-client";

interface BadgesPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function BadgesPage({ params }: BadgesPageProps) {
  const { eventId } = await params;

  return <BadgesClient eventId={eventId} />;
}
