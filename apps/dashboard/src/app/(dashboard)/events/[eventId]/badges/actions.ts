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

// V1 field schema (legacy)
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

// V1 config schema (legacy)
const badgeConfigV1Schema = z.object({
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

// V2 element schema
const badgeElementSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "image", "qr", "shape", "line"]),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
  zIndex: z.number(),
  locked: z.boolean(),
  visible: z.boolean(),
  // Text-specific
  text: z.string().optional(),
  mergeField: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  fontWeight: z.number().optional(),
  fontColor: z.string().optional(),
  textAlign: z.enum(["left", "center", "right"]).optional(),
  lineHeight: z.number().optional(),
  letterSpacing: z.number().optional(),
  // Image-specific
  src: z.string().optional(),
  opacity: z.number().optional(),
  cornerRadius: z.number().optional(),
  // QR-specific
  qrForeground: z.string().optional(),
  qrBackground: z.string().optional(),
  // Shape-specific
  shapeType: z.enum(["rect", "roundedRect", "circle"]).optional(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  dashPattern: z.array(z.number()).optional(),
});

// V2 config schema
const badgeConfigV2Schema = z.object({
  version: z.literal(2),
  width: z.number().positive(),
  height: z.number().positive(),
  dpi: z.number().positive(),
  backgroundColor: z.string(),
  elements: z.array(badgeElementSchema),
});

// Accept either V1 or V2
const badgeConfigSchema = z.union([badgeConfigV1Schema, badgeConfigV2Schema]);

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
