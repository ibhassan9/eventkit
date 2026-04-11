import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@eventkit/db/queries";
import { getAttendeeUser, getAttendeeForEvent } from "@/lib/attendee-auth";
import { MyRegistrationContent } from "./my-registration-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  return {
    title: `My Registration - ${event.name} | EventKit`,
    description: `Your registration details for ${event.name}`,
  };
}

export default async function MyRegistrationPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const user = await getAttendeeUser();
  if (!user) {
    redirect(`/${slug}`);
  }

  const attendee = await getAttendeeForEvent(user.id, event.id);
  if (!attendee) {
    redirect(`/${slug}`);
  }

  const primaryColor =
    event.websiteConfig?.theme.primaryColor ?? "#1a1a2e";
  const secondaryColor =
    event.websiteConfig?.theme.secondaryColor ?? "#6366f1";

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <MyRegistrationContent
          attendee={{
            id: attendee.id,
            firstName: attendee.firstName,
            lastName: attendee.lastName,
            email: attendee.email,
            company: attendee.company,
            jobTitle: attendee.jobTitle,
            qrCode: attendee.qrCode,
            paymentStatus: attendee.paymentStatus,
            customFieldValues: (attendee.customFieldValues as Record<string, string>) ?? {},
            ticketTypeName: attendee.ticketType?.name ?? "General",
          }}
          event={{
            name: event.name,
            slug: event.slug,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            venue: event.venue ?? undefined,
            address: event.address ?? undefined,
          }}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>
    </div>
  );
}
