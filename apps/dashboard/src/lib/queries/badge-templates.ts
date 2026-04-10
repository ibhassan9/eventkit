"use server";

import { z } from "zod";
import { createSafeQueryWithInput } from "@/lib/safe-action";
import { getBadgeTemplatesByEventId, getEventById } from "@eventkit/db/queries";

export const fetchBadgeTemplates = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    const templates = await getBadgeTemplatesByEventId(input.eventId);
    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      config: t.config,
      isDefault: t.isDefault,
    }));
  }
);
