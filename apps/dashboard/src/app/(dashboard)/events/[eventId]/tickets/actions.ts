"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import {
  getEventById,
  getTicketTypeById,
  createTicketType,
  updateTicketType,
  getTicketTypesByEventId,
} from "@eventkit/db/queries";

async function verifyEventOwnership(eventId: string, organizationId: string) {
  const event = await getEventById(eventId);
  if (!event || event.organizationId !== organizationId) {
    throw new Error("Event not found");
  }
  return event;
}

export const duplicateTicketTypeAction = createSafeAction(
  z.object({
    eventId: z.string().uuid(),
    ticketTypeId: z.string().uuid(),
  }),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);

    const source = await getTicketTypeById(input.ticketTypeId);
    if (!source) throw new Error("Ticket type not found");

    const existing = await getTicketTypesByEventId(input.eventId);
    const maxSort = existing.reduce(
      (max, t) => Math.max(max, t.sortOrder),
      0
    );

    const duplicate = await createTicketType({
      eventId: input.eventId,
      name: `${source.name} (Copy)`,
      description: source.description ?? undefined,
      price: source.price,
      capacity: source.capacity ?? undefined,
      salesStart: source.salesStart ?? undefined,
      salesEnd: source.salesEnd ?? undefined,
      sortOrder: maxSort + 1,
      isVisible: source.isVisible,
      allowWaitlist: source.allowWaitlist,
      minPerOrder: source.minPerOrder,
      maxPerOrder: source.maxPerOrder,
    });

    return duplicate;
  }
);

export const reorderTicketTypesAction = createSafeAction(
  z.object({
    eventId: z.string().uuid(),
    orderedIds: z.array(z.string().uuid()),
  }),
  async (input, ctx) => {
    await verifyEventOwnership(input.eventId, ctx.organizationId);

    await Promise.all(
      input.orderedIds.map((id, index) =>
        updateTicketType(id, { sortOrder: index })
      )
    );
  }
);
