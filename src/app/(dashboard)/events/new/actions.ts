"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { createEventSchema } from "@/lib/validators";
import { createEvent, getEventBySlug } from "@/db/queries";

const createEventWithSlug = createEventSchema.and(
  z.object({ slug: z.string().min(1) })
);

export const createNewEvent = createSafeAction(
  createEventWithSlug,
  async (input, ctx) => {
    let slug = input.slug;
    const existing = await getEventBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const event = await createEvent({
      organizationId: ctx.organizationId,
      name: input.name,
      slug,
      description: input.description,
      venue: input.venue,
      address: input.address,
      startDate: input.startDate,
      endDate: input.endDate,
      timezone: input.timezone,
      currency: input.currency,
    });

    revalidatePath("/dashboard");
    return event;
  }
);
