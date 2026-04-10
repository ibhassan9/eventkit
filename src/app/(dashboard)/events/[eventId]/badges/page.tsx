import { getBadgeTemplatesByEventId, getEventById } from "@/db/queries";
import { notFound } from "next/navigation";
import { BadgesClient } from "./badges-client";

interface BadgesPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function BadgesPage({ params }: BadgesPageProps) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  const templates = await getBadgeTemplatesByEventId(eventId);

  const serialized = templates.map((t) => ({
    id: t.id,
    name: t.name,
    config: t.config,
    isDefault: t.isDefault,
  }));

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Badge Designer</h1>
        <p className="text-muted-foreground">
          Design attendee badges for {event.name}.
        </p>
      </div>
      <BadgesClient eventId={eventId} initialTemplates={serialized} />
    </div>
  );
}
