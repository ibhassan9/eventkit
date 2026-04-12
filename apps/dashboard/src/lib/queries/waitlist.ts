"use server";

import { z } from "zod";
import { createSafeQueryWithInput } from "@/lib/safe-action";
import {
  getEventById,
  getWaitlistEntriesByEvent,
  getWaitlistStats,
  getWaitlistCountsByTicketType,
} from "@eventkit/db/queries";

export const fetchWaitlistEntries = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return getWaitlistEntriesByEvent(input.eventId);
  }
);

export const fetchWaitlistStats = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return getWaitlistStats(input.eventId);
  }
);

export const fetchWaitlistCounts = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return getWaitlistCountsByTicketType(input.eventId);
  }
);
