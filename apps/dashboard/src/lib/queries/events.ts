"use server";

import { z } from "zod";
import {
  createSafeQuery,
  createSafeQueryWithInput,
} from "@/lib/safe-action";
import {
  getEventsWithCountsByOrgId,
  getEventWithStats,
  getEventById,
} from "@eventkit/db/queries";

export const fetchEvents = createSafeQuery(async (ctx) => {
  return getEventsWithCountsByOrgId(ctx.organizationId);
});

export const fetchEventWithStats = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventWithStats(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return event;
  }
);

export const fetchEventById = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return event;
  }
);
