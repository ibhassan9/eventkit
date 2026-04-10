"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  saveRegistrationConfigSchema,
  suggestRegistrationFieldsSchema,
} from "@eventkit/lib/validators";
import { getEventById, updateEvent } from "@eventkit/db/queries";
import { generateStructuredOutput, AI_PROMPTS } from "@eventkit/lib/ai";
import type { CustomField } from "@eventkit/types";

export const saveRegistrationConfig = createSafeAction(
  saveRegistrationConfigSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    await updateEvent(input.eventId, {
      registrationFields: input.config,
    });

    revalidatePath(`/events/${input.eventId}/registration`);
    return { saved: true };
  }
);

export const suggestRegistrationFields = createSafeAction(
  suggestRegistrationFieldsSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const result = await generateStructuredOutput<{ fields: CustomField[] }>({
      systemPrompt: AI_PROMPTS.registrationFormBuilder,
      userMessage: `Event: ${event.name}\nDescription: ${event.description ?? "No description"}\nVenue: ${event.venue ?? "TBD"}`,
      toolName: "suggest_fields",
      toolDescription: "Suggest registration form custom fields",
      inputSchema: {
        type: "object" as const,
        properties: {
          fields: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                id: { type: "string" as const },
                type: {
                  type: "string" as const,
                  enum: ["text", "textarea", "select", "checkbox", "radio"],
                },
                label: { type: "string" as const },
                placeholder: { type: "string" as const },
                required: { type: "boolean" as const },
                options: { type: "array" as const, items: { type: "string" as const } },
                order: { type: "number" as const },
              },
              required: ["id", "type", "label", "required", "order"],
            },
          },
        },
        required: ["fields"],
      },
    });

    return result.fields;
  }
);
