"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  saveWebsiteConfigSchema,
  generateWebsiteConfigSchema,
  saveWebsitePagesSchema,
} from "@eventkit/lib/validators";
import { getEventById, updateEvent } from "@eventkit/db/queries";
import { generateStructuredOutput, AI_PROMPTS } from "@eventkit/lib/ai";
import type { WebsiteConfig } from "@eventkit/types";

export const saveWebsiteConfig = createSafeAction(
  saveWebsiteConfigSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    await updateEvent(input.eventId, {
      websiteConfig: input.config,
    });

    revalidatePath(`/events/${input.eventId}/website`);
    revalidatePath(`/${event.slug}`);
    return { saved: true };
  }
);

export const generateWebsiteConfig = createSafeAction(
  generateWebsiteConfigSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const config = await generateStructuredOutput<WebsiteConfig>({
      systemPrompt: AI_PROMPTS.websiteGenerator,
      userMessage: buildAIPrompt(event),
      toolName: "generate_website_config",
      toolDescription: "Generate a website configuration for the event",
      inputSchema: websiteConfigAISchema,
      maxTokens: 4096,
    });

    return config;
  }
);

function buildAIPrompt(event: {
  name: string;
  description: string | null;
  venue: string | null;
  address: string | null;
  startDate: Date;
  endDate: Date;
}): string {
  return [
    `Event Name: ${event.name}`,
    event.description ? `Description: ${event.description}` : "",
    event.venue ? `Venue: ${event.venue}` : "",
    event.address ? `Address: ${event.address}` : "",
    `Start: ${event.startDate.toISOString()}`,
    `End: ${event.endDate.toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const websiteConfigAISchema = {
  type: "object" as const,
  properties: {
    theme: {
      type: "object" as const,
      properties: {
        primaryColor: { type: "string" as const },
        secondaryColor: { type: "string" as const },
        backgroundColor: { type: "string" as const },
        fontFamily: { type: "string" as const, enum: ["inter", "system"] },
      },
      required: ["primaryColor", "secondaryColor", "backgroundColor", "fontFamily"],
    },
    sections: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          type: { type: "string" as const },
          enabled: { type: "boolean" as const },
          data: { type: "object" as const },
        },
        required: ["type", "enabled", "data"],
      },
    },
  },
  required: ["theme", "sections"],
};

export const saveWebsitePages = createSafeAction(
  saveWebsitePagesSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    await updateEvent(input.eventId, {
      websitePages: input.websitePages,
    });

    revalidatePath(`/events/${input.eventId}/website`);
    revalidatePath(`/${event.slug}`);
    return { saved: true };
  }
);
