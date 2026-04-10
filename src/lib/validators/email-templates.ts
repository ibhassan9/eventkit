import { z } from "zod";

export const emailTypeValues = [
  "confirmation",
  "reminder",
  "update",
  "custom",
] as const;

export const createEmailTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Body is required"),
  type: z.enum(emailTypeValues).default("custom"),
  isActive: z.boolean().default(true),
});

export const updateEmailTemplateSchema = createEmailTemplateSchema.partial();

export type CreateEmailTemplateInput = z.infer<
  typeof createEmailTemplateSchema
>;
export type UpdateEmailTemplateInput = z.infer<
  typeof updateEmailTemplateSchema
>;
