import { EmailsClient } from "./emails-client";

interface EmailsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EmailsPage({ params }: EmailsPageProps) {
  const { eventId } = await params;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <p className="text-muted-foreground">
          Create and manage email communications for your event.
        </p>
      </div>
      <EmailsClient eventId={eventId} />
    </div>
  );
}
