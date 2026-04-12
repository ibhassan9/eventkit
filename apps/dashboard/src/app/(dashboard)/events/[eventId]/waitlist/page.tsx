import { WaitlistClient } from "./waitlist-client";

interface WaitlistPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function WaitlistPage({ params }: WaitlistPageProps) {
  const { eventId } = await params;

  return <WaitlistClient eventId={eventId} />;
}
