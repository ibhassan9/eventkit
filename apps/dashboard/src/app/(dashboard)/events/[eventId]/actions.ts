"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { updateEventSchema, createTicketTypeSchema, updateTicketTypeSchema } from "@eventkit/lib/validators";
import {
  getEventById,
  updateEvent,
  deleteEvent,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from "@eventkit/db/queries";

async function verifyEventOwnership(eventId: string, organizationId: string) {
  const event = await getEventById(eventId);
  if (!event || event.organizationId !== organizationId) {
    throw new Error("Event not found");
  }
  return event;
}

export const updateEventAction = createSafeAction(
  updateEventSchema.and(z.object({ eventId: z.string().uuid() })),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);
    const { eventId, ...data } = input;
    const event = await updateEvent(eventId, data);
    revalidatePath(`/events/${eventId}`);
    return event;
  }
);

export const deleteEventAction = createSafeAction(
  z.object({ eventId: z.string().uuid() }),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);
    await deleteEvent(input.eventId);
    revalidatePath("/dashboard");
  }
);

export const createTicketTypeAction = createSafeAction(
  createTicketTypeSchema.and(z.object({ eventId: z.string().uuid() })),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);
    const { eventId, ...data } = input;
    const ticket = await createTicketType({ ...data, eventId });
    revalidatePath(`/events/${eventId}`);
    return ticket;
  }
);

export const updateTicketTypeAction = createSafeAction(
  updateTicketTypeSchema.and(
    z.object({
      ticketTypeId: z.string().uuid(),
      eventId: z.string().uuid(),
    })
  ),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);
    const { ticketTypeId, eventId, ...data } = input;
    const ticket = await updateTicketType(ticketTypeId, data);
    revalidatePath(`/events/${eventId}`);
    return ticket;
  }
);

export const deleteTicketTypeAction = createSafeAction(
  z.object({
    ticketTypeId: z.string().uuid(),
    eventId: z.string().uuid(),
  }),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);
    await deleteTicketType(input.ticketTypeId);
    revalidatePath(`/events/${input.eventId}`);
  }
);

export const cancelEventAction = createSafeAction(
  z.object({ eventId: z.string().uuid(), refundAll: z.boolean().default(false) }),
  async (input, ctx) => {
    const event = await verifyEventOwnership(input.eventId, ctx.organizationId);
    if (event.status === "cancelled") throw new Error("Event is already cancelled");

    await updateEvent(input.eventId, { status: "cancelled" });

    // Get all attendees to notify
    const { getAttendeesByEventId } = await import("@eventkit/db/queries");
    const attendees = await getAttendeesByEventId(input.eventId);

    // Send cancellation emails
    if (attendees.length > 0) {
      const { sendEmail } = await import("@eventkit/lib/resend");
      const { EventCancelledEmail } = await import("@eventkit/emails");
      const { formatDateRange } = await import("@eventkit/lib/utils");

      const eventDate = formatDateRange(event.startDate, event.endDate, event.timezone);
      const refundInfo = input.refundAll
        ? "A full refund has been initiated and should appear within 5-10 business days."
        : undefined;

      for (const attendee of attendees) {
        try {
          await sendEmail({
            to: attendee.email,
            subject: `${event.name} has been cancelled`,
            react: EventCancelledEmail({
              attendeeName: `${attendee.firstName} ${attendee.lastName}`,
              eventName: event.name,
              eventDate,
              venue: event.venue ?? undefined,
              refundInfo,
            }),
          });
        } catch {} // Don't fail if an individual email fails
      }
    }

    // Optionally refund all paid orders
    if (input.refundAll) {
      const { getOrderByAttendeeAndEvent, updateOrderPaymentStatus } = await import("@eventkit/db/queries");
      const { createRefund } = await import("@eventkit/lib/stripe");

      for (const attendee of attendees) {
        try {
          const order = await getOrderByAttendeeAndEvent(attendee.id, input.eventId);
          if (order && order.paymentStatus === "paid" && order.stripePaymentIntentId) {
            await createRefund({ paymentIntentId: order.stripePaymentIntentId });
            await updateOrderPaymentStatus(order.id, { paymentStatus: "refunded" });
          }
        } catch {} // Don't fail the whole cancel if a single refund fails
      }
    }

    // Cancel all waitlist entries
    const { cancelAllWaitlistEntriesByEvent } = await import("@eventkit/db/queries");
    await cancelAllWaitlistEntriesByEvent(input.eventId).catch(() => {});

    revalidatePath(`/events/${input.eventId}`);
    revalidatePath("/dashboard");
  }
);

export const completeEventAction = createSafeAction(
  z.object({ eventId: z.string().uuid() }),
  async (input, ctx) => {
    const event = await verifyEventOwnership(input.eventId, ctx.organizationId);
    if (event.status === "cancelled") throw new Error("Cannot complete a cancelled event");
    await updateEvent(input.eventId, { status: "completed" });
    revalidatePath(`/events/${input.eventId}`);
    revalidatePath("/dashboard");
  }
);
