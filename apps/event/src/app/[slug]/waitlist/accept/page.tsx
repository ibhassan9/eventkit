import { notFound } from "next/navigation";
import { getEventBySlug, getWaitlistEntryById } from "@eventkit/db/queries";
import { verifyWaitlistToken } from "@eventkit/lib/waitlist-token";
import { AcceptForm } from "./accept-form";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ entryId?: string; token?: string }>;
}

export default async function WaitlistAcceptPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { entryId, token } = await searchParams;

  if (!entryId || !token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Invalid Link
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          This waitlist acceptance link is invalid or incomplete.
        </p>
      </div>
    );
  }

  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const entry = await getWaitlistEntryById(entryId);
  if (!entry || entry.eventId !== event.id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Entry Not Found
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          This waitlist entry could not be found.
        </p>
      </div>
    );
  }

  // Verify token
  const isValidToken = verifyWaitlistToken(token, entryId, entry.email);
  if (!isValidToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Invalid Token
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          This link is invalid. Please check your email for the correct link.
        </p>
      </div>
    );
  }

  // Check if already accepted
  if (entry.status === "accepted") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Already Accepted
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            You have already accepted this offer and are registered for{" "}
            {event.name}.
          </p>
        </div>
      </div>
    );
  }

  // Check if offer is expired
  if (entry.status === "expired") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Offer Expired
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Unfortunately, this offer has expired. The spot has been offered to the
          next person on the waitlist.
        </p>
      </div>
    );
  }

  // Check if status is 'offered' and not yet expired by time
  if (entry.status !== "offered") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Offer Unavailable
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          This waitlist offer is no longer available.
        </p>
      </div>
    );
  }

  // Check if offer has expired by time
  if (
    entry.offerExpiresAt &&
    new Date(entry.offerExpiresAt) < new Date()
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Offer Expired
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          This offer expired on{" "}
          {new Date(entry.offerExpiresAt).toLocaleDateString()}. The spot
          has been offered to the next person on the waitlist.
        </p>
      </div>
    );
  }

  const primaryColor =
    event.websiteConfig?.theme.primaryColor ?? "#1a1a2e";
  const secondaryColor =
    event.websiteConfig?.theme.secondaryColor ?? "#6366f1";

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-lg px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: primaryColor }}
            >
              A spot opened up!
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Great news, {entry.firstName}! A spot for{" "}
              <strong>{entry.ticketType?.name ?? "this ticket"}</strong> at{" "}
              <strong>{event.name}</strong> is available for you.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-zinc-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Event</span>
              <span className="font-medium text-zinc-900">{event.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Ticket</span>
              <span className="font-medium text-zinc-900">
                {entry.ticketType?.name ?? "General"}
              </span>
            </div>
            {event.venue && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Venue</span>
                <span className="font-medium text-zinc-900">
                  {event.venue}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Offer expires</span>
              <span className="font-medium text-amber-600">
                {entry.offerExpiresAt
                  ? new Date(entry.offerExpiresAt).toLocaleString()
                  : "48 hours"}
              </span>
            </div>
          </div>

          <AcceptForm
            entryId={entry.id}
            token={token}
            eventSlug={slug}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>
    </div>
  );
}
