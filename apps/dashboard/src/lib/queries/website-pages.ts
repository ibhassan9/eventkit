"use server";

import { z } from "zod";
import { createSafeQueryWithInput } from "@/lib/safe-action";
import { getEventById } from "@eventkit/db/queries";
import { defaultWebsitePages } from "@eventkit/lib/default-website-pages";

export const fetchWebsitePages = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    return {
      websitePages: event.websitePages ?? defaultWebsitePages(),
      eventSlug: event.slug,
    };
  }
);
