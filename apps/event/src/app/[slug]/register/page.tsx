import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug, getTicketTypesByEventId } from "@eventkit/db/queries";
import { getAttendeeUser, getAttendeeForEvent } from "@/lib/attendee-auth";
import { RegistrationForm } from "./registration-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  return {
    title: `Register - ${event.name} | EventKit`,
    description: `Register for ${event.name}`,
  };
}

export default async function RegisterPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const attendeeUser = await getAttendeeUser();
  if (attendeeUser) {
    const existingAttendee = await getAttendeeForEvent(attendeeUser.id, event.id);
    if (existingAttendee) {
      redirect(`/${slug}/my-registration`);
    }
  }

  const ticketTypes = await getTicketTypesByEventId(event.id);
  const visibleTickets = ticketTypes.filter((t) => t.isVisible);

  if (visibleTickets.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Registration Unavailable
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          No tickets are currently available for this event.
        </p>
      </div>
    );
  }

  const primaryColor =
    event.websiteConfig?.theme.primaryColor ?? "#1a1a2e";
  const secondaryColor =
    event.websiteConfig?.theme.secondaryColor ?? "#6366f1";

  const customFields = event.registrationFields?.fields ?? [];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: primaryColor }}
          >
            Register for {event.name}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Select your ticket and fill in your details below.
          </p>
        </div>
        <RegistrationForm
          eventId={event.id}
          eventSlug={slug}
          ticketTypes={visibleTickets.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            price: t.price,
          }))}
          customFields={customFields}
          currency={event.currency}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>
    </div>
  );
}
