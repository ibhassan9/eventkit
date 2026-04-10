import { z } from "zod";

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
  width: z.number().int().positive().default(288),
  height: z.number().int().positive().default(216),
  preset: z.enum(["minimal", "corporate", "bold", "modern"]),
  backgroundColor: z.string(),
  textColor: z.string(),
  accentColor: z.string(),
  fields: z.array(badgeFieldSchema),
  showQrCode: z.boolean(),
  qrCodePosition: z.enum(["bottom-right", "bottom-left", "bottom-center"]),
  qrCodeSize: z.number().positive(),
  logoUrl: z.string().url().optional(),
});

export const createBadgeTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  config: badgeConfigSchema,
  isDefault: z.boolean().default(false),
});

export const updateBadgeTemplateSchema = createBadgeTemplateSchema.partial();

export type CreateBadgeTemplateInput = z.infer<
  typeof createBadgeTemplateSchema
>;
export type UpdateBadgeTemplateInput = z.infer<
  typeof updateBadgeTemplateSchema
>;
