"use server";

import { z } from "zod";
import { createSafeQueryWithInput } from "@/lib/safe-action";
import { getEmailTemplatesByEventId, getEventById } from "@eventkit/db/queries";

export const fetchEmailTemplates = createSafeQueryWithInput(
  z.object({ eventId: z.string() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }
    const templates = await getEmailTemplatesByEventId(input.eventId);
    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      subject: t.subject,
      body: t.body,
      type: t.type,
    }));
  }
);
