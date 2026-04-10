"use server";

import { z } from "zod";
import { createSafeQueryWithInput } from "@/lib/safe-action";
import { getTicketTypesByEventId, getEventById } from "@eventkit/db/queries";

export const fetchTicketTypes = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return getTicketTypesByEventId(input.eventId);
  }
);
