"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { getEventById } from "@/db/queries";
import { generateStructuredOutput, AI_PROMPTS } from "@/lib/ai";

const generateSchema = z.object({
  eventId: z.string().uuid(),
  purpose: z.enum(["confirmation", "reminder", "update", "custom"]),
});

export const generateEmailContent = createSafeAction(
  generateSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const result = await generateStructuredOutput<{
      subject: string;
      body: string;
    }>({
      systemPrompt: AI_PROMPTS.emailWriter,
      userMessage: `Generate a ${input.purpose} email for this event:
Name: ${event.name}
Date: ${event.startDate.toISOString()}
Venue: ${event.venue ?? "TBD"}
Description: ${event.description ?? "No description"}

Return HTML body using merge tags where appropriate.`,
      toolName: "generate_email",
      toolDescription: "Generate email subject and HTML body",
      inputSchema: {
        type: "object" as const,
        properties: {
          subject: {
            type: "string" as const,
            description: "Email subject line",
          },
          body: {
            type: "string" as const,
            description: "HTML email body with merge tags",
          },
        },
        required: ["subject", "body"],
      },
    });

    return result;
  }
);
