import { NextResponse } from "next/server";
import {
  expireWaitlistOffers,
  getNextWaitingEntry,
  offerWaitlistSpot,
  getWaitlistEntryById,
} from "@eventkit/db/queries";
import { generateWaitlistToken } from "@eventkit/lib/waitlist-token";
import { sendEmail } from "@eventkit/lib/resend";
import { WaitlistOfferEmail } from "@eventkit/emails";
import { formatDateRange } from "@eventkit/lib/utils";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Expire overdue offers
  const expired = await expireWaitlistOffers();

  // For each expired entry, offer to next in line
  let offered = 0;
  const processedTicketTypes = new Set<string>();

  for (const entry of expired) {
    if (processedTicketTypes.has(entry.ticketTypeId)) continue;
    processedTicketTypes.add(entry.ticketTypeId);

    const next = await getNextWaitingEntry(entry.ticketTypeId);
    if (!next) continue;

    const updated = await offerWaitlistSpot(next.id, 48);

    // Send offer email
    try {
      const fullEntry = await getWaitlistEntryById(next.id);
      if (!fullEntry?.event) continue;

      const event = fullEntry.event;
      const token = generateWaitlistToken(next.id, next.email);
      const baseUrl =
        process.env.NEXT_PUBLIC_EVENT_URL ?? "http://localhost:3002";
      const acceptUrl = `${baseUrl}/${event.slug}/waitlist/accept?entryId=${next.id}&token=${token}`;

      const eventDate = formatDateRange(
        event.startDate,
        event.endDate,
        event.timezone
      );
      const expiresAt = updated.offerExpiresAt
        ? new Date(updated.offerExpiresAt).toLocaleString()
        : "48 hours";

      await sendEmail({
        to: next.email,
        subject: `A spot opened up at ${event.name}!`,
        react: WaitlistOfferEmail({
          attendeeName: `${next.firstName} ${next.lastName}`,
          eventName: event.name,
          eventDate,
          venue: event.venue ?? undefined,
          ticketType: fullEntry.ticketType?.name ?? "General",
          acceptUrl,
          expiresAt,
        }),
      });
    } catch {
      // Email failure should not break the cron
    }

    offered++;
  }

  return NextResponse.json({ expired: expired.length, offered });
}
