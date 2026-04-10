import { notFound } from "next/navigation";
import { getEventBySlug } from "@eventkit/db/queries";
import { defaultWebsitePages } from "@eventkit/lib/default-website-pages";
import { SuccessContent } from "./success-content";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qr?: string; session_id?: string }>;
}

export default async function RegistrationSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { qr, session_id } = await searchParams;

  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const primaryColor =
    event.websiteConfig?.theme.primaryColor ?? "#1a1a2e";
  const secondaryColor =
    event.websiteConfig?.theme.secondaryColor ?? "#6366f1";

  const websitePages = event.websitePages ?? defaultWebsitePages();
  const scheduleVisible = websitePages.pages.schedule.visible;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <SuccessContent
        eventName={event.name}
        eventSlug={slug}
        eventDate={event.startDate.toISOString()}
        eventEndDate={event.endDate.toISOString()}
        venue={event.venue ?? undefined}
        address={event.address ?? undefined}
        qrCode={qr ?? undefined}
        sessionId={session_id ?? undefined}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        scheduleVisible={scheduleVisible}
      />
    </div>
  );
}
