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

const badgeConfigV1Schema = z.object({
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
  text: z.string().optional(),
  mergeField: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  fontWeight: z.number().optional(),
  fontColor: z.string().optional(),
  textAlign: z.enum(["left", "center", "right"]).optional(),
  lineHeight: z.number().optional(),
  letterSpacing: z.number().optional(),
  src: z.string().optional(),
  opacity: z.number().optional(),
  cornerRadius: z.number().optional(),
  qrForeground: z.string().optional(),
  qrBackground: z.string().optional(),
  shapeType: z.enum(["rect", "roundedRect", "circle"]).optional(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  dashPattern: z.array(z.number()).optional(),
});

const badgeConfigV2Schema = z.object({
  version: z.literal(2),
  width: z.number().positive(),
  height: z.number().positive(),
  dpi: z.number().positive(),
  backgroundColor: z.string(),
  elements: z.array(badgeElementSchema),
});

const badgeConfigSchema = z.union([badgeConfigV1Schema, badgeConfigV2Schema]);

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
