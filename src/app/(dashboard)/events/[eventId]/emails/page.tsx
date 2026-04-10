import { getEmailTemplatesByEventId, getEventById } from "@/db/queries";
import { notFound } from "next/navigation";
import { ensureDefaultTemplates } from "./default-templates";
import { EmailsClient } from "./emails-client";

interface EmailsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EmailsPage({ params }: EmailsPageProps) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) notFound();

  const templates = await ensureDefaultTemplates(eventId);
  const allTemplates = templates.length > 0
    ? templates
    : await getEmailTemplatesByEventId(eventId);

  const serialized = allTemplates.map((t) => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    body: t.body,
    type: t.type,
  }));

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <p className="text-muted-foreground">
          Create and manage email communications for {event.name}.
        </p>
      </div>
      <EmailsClient eventId={eventId} initialTemplates={serialized} />
    </div>
  );
}
