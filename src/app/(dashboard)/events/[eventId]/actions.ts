"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { updateEventSchema, createTicketTypeSchema, updateTicketTypeSchema } from "@/lib/validators";
import {
  getEventById,
  updateEvent,
  deleteEvent,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from "@/db/queries";

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
