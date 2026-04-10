import { BadgesClient } from "./badges-client";

interface BadgesPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function BadgesPage({ params }: BadgesPageProps) {
  const { eventId } = await params;

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Badge Designer</h1>
        <p className="text-muted-foreground">
          Design attendee badges for your event.
        </p>
      </div>
      <BadgesClient eventId={eventId} />
    </div>
  );
}
