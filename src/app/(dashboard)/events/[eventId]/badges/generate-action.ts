"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { getEventById } from "@/db/queries";
import { generateStructuredOutput, AI_PROMPTS } from "@/lib/ai";
import type { BadgeConfig } from "@/types";

const generateSchema = z.object({
  eventId: z.string().uuid(),
});

export const generateBadgeDesign = createSafeAction(
  generateSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const result = await generateStructuredOutput<{ config: BadgeConfig }>({
      systemPrompt: AI_PROMPTS.badgeDesigner,
      userMessage: `Design a badge for this event:
Name: ${event.name}
Venue: ${event.venue ?? "TBD"}
Description: ${event.description ?? "A professional event"}

Badge dimensions: 288pt wide x 216pt tall (4"x3").
Return a config with preset, colors, fields with positions, QR code settings.
Field types: firstName, lastName, fullName, company, jobTitle, ticketType.
X/Y in points from top-left. Center: x=144, y=108.`,
      toolName: "design_badge",
      toolDescription: "Generate a badge configuration",
      inputSchema: {
        type: "object" as const,
        properties: {
          config: {
            type: "object" as const,
            properties: {
              width: { type: "number" as const },
              height: { type: "number" as const },
              preset: {
                type: "string" as const,
                enum: ["minimal", "corporate", "bold", "modern"],
              },
              backgroundColor: { type: "string" as const },
              textColor: { type: "string" as const },
              accentColor: { type: "string" as const },
              fields: {
                type: "array" as const,
                items: {
                  type: "object" as const,
                  properties: {
                    id: { type: "string" as const },
                    type: { type: "string" as const },
                    label: { type: "string" as const },
                    fontSize: { type: "number" as const },
                    fontWeight: { type: "string" as const },
                    color: { type: "string" as const },
                    x: { type: "number" as const },
                    y: { type: "number" as const },
                    textAlign: { type: "string" as const },
                  },
                  required: [
                    "id", "type", "fontSize", "fontWeight",
                    "x", "y", "textAlign",
                  ],
                },
              },
              showQrCode: { type: "boolean" as const },
              qrCodePosition: { type: "string" as const },
              qrCodeSize: { type: "number" as const },
            },
            required: [
              "width", "height", "preset", "backgroundColor",
              "textColor", "accentColor", "fields", "showQrCode",
              "qrCodePosition", "qrCodeSize",
            ],
          },
        },
        required: ["config"],
      },
    });

    return result;
  }
);
