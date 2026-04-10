import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getEventById } from "@/db/queries";
import { getOrganizationByClerkUserId } from "@/db/queries";
import { WebsiteEditor } from "./website-editor";
import { defaultWebsiteConfig } from "./default-config";

export default async function WebsiteEditorPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { eventId } = await params;
  const org = await getOrganizationByClerkUserId(userId);
  if (!org) redirect("/onboarding");

  const event = await getEventById(eventId);
  if (!event || event.organizationId !== org.id) notFound();

  const config = event.websiteConfig ?? defaultWebsiteConfig(event.name);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Event Website</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Design your public event page. Visitors will see this at{" "}
          <span className="font-medium text-foreground">
            eventkit.app/{event.slug}
          </span>
        </p>
      </div>
      <WebsiteEditor
        eventId={eventId}
        eventSlug={event.slug}
        initialConfig={config}
      />
    </div>
  );
}
