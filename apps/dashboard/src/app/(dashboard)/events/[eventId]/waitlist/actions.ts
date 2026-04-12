"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  getEventById,
  getWaitlistEntryById,
  offerWaitlistSpot,
  cancelWaitlistEntry,
} from "@eventkit/db/queries";
import { generateWaitlistToken } from "@eventkit/lib/waitlist-token";
import { sendEmail } from "@eventkit/lib/resend";
import { WaitlistOfferEmail } from "@eventkit/emails";
import { formatDateRange } from "@eventkit/lib/utils";

async function verifyEventOwnership(
  eventId: string,
  organizationId: string
) {
  const event = await getEventById(eventId);
  if (!event || event.organizationId !== organizationId) {
    throw new Error("Event not found");
  }
  return event;
}

export const offerSpotAction = createSafeAction(
  z.object({
    eventId: z.string().uuid(),
    entryId: z.string().uuid(),
    expiresInHours: z.number().int().min(1).max(168).default(48),
  }),
  async (input, ctx) => {
    const event = await verifyEventOwnership(input.eventId, ctx.organizationId);
    const entry = await getWaitlistEntryById(input.entryId);
    if (!entry || entry.eventId !== input.eventId) {
      throw new Error("Entry not found");
    }
    if (entry.status !== "waiting") {
      throw new Error("Entry is not in waiting status");
    }

    const updated = await offerWaitlistSpot(input.entryId, input.expiresInHours);

    // Generate acceptance URL
    const token = generateWaitlistToken(entry.id, entry.email);
    const baseUrl =
      process.env.NEXT_PUBLIC_EVENT_URL ?? "http://localhost:3002";
    const acceptUrl = `${baseUrl}/${event.slug}/waitlist/accept?entryId=${entry.id}&token=${token}`;

    // Send offer email
    const eventDate = formatDateRange(
      event.startDate,
      event.endDate,
      event.timezone
    );
    const expiresAt = updated.offerExpiresAt
      ? new Date(updated.offerExpiresAt).toLocaleString()
      : "48 hours";

    await sendEmail({
      to: entry.email,
      subject: `A spot opened up at ${event.name}!`,
      react: WaitlistOfferEmail({
        attendeeName: `${entry.firstName} ${entry.lastName}`,
        eventName: event.name,
        eventDate,
        venue: event.venue ?? undefined,
        ticketType: entry.ticketType?.name ?? "General",
        acceptUrl,
        expiresAt,
      }),
    }).catch(() => {});

    revalidatePath(`/events/${input.eventId}/waitlist`);
    return updated;
  }
);

export const cancelWaitlistEntryAction = createSafeAction(
  z.object({
    eventId: z.string().uuid(),
    entryId: z.string().uuid(),
  }),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);
    const entry = await getWaitlistEntryById(input.entryId);
    if (!entry || entry.eventId !== input.eventId) {
      throw new Error("Entry not found");
    }

    await cancelWaitlistEntry(input.entryId);
    revalidatePath(`/events/${input.eventId}/waitlist`);
  }
);
