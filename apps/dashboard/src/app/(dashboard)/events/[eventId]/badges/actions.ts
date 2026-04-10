"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  createBadgeTemplate,
  updateBadgeTemplate,
  deleteBadgeTemplate,
  getEventById,
} from "@eventkit/db/queries";

const badgeFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    "firstName",
    "lastName",
    "fullName",
    "company",
    "jobTitle",
    "ticketType",
    "custom",
  ]),
  label: z.string().optional(),
  fontSize: z.number().positive(),
  fontWeight: z.enum(["normal", "bold"]),
  color: z.string().optional(),
  x: z.number(),
  y: z.number(),
  textAlign: z.enum(["left", "center", "right"]),
});

const badgeConfigSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  preset: z.enum(["minimal", "corporate", "bold", "modern"]),
  backgroundColor: z.string(),
  textColor: z.string(),
  accentColor: z.string(),
  fields: z.array(badgeFieldSchema),
  showQrCode: z.boolean(),
  qrCodePosition: z.enum(["bottom-right", "bottom-left", "bottom-center"]),
  qrCodeSize: z.number().positive(),
  logoUrl: z.string().optional(),
});

const saveSchema = z.object({
  eventId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  config: badgeConfigSchema,
});

export const saveBadgeTemplate = createSafeAction(
  saveSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    if (input.templateId) {
      const updated = await updateBadgeTemplate(input.templateId, {
        name: input.name,
        config: input.config,
      });
      revalidatePath(`/events/${input.eventId}/badges`);
      return updated;
    }

    const created = await createBadgeTemplate({
      eventId: input.eventId,
      name: input.name,
      config: input.config,
      isDefault: true,
    });
    revalidatePath(`/events/${input.eventId}/badges`);
    return created;
  }
);

const deleteSchema = z.object({
  eventId: z.string().uuid(),
  templateId: z.string().uuid(),
});

export const deleteBadgeTemplateAction = createSafeAction(
  deleteSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    await deleteBadgeTemplate(input.templateId);
    revalidatePath(`/events/${input.eventId}/badges`);
  }
);
