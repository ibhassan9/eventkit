import { z } from "zod";

const customFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "textarea", "select", "checkbox", "radio"]),
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean(),
  options: z.array(z.string().min(1).max(100)).optional(),
  order: z.number().int().min(0),
});

export const registrationConfigSchema = z.object({
  fields: z.array(customFieldSchema).max(20),
});

export const saveRegistrationConfigSchema = z.object({
  eventId: z.string().uuid(),
  config: registrationConfigSchema,
});

export const suggestRegistrationFieldsSchema = z.object({
  eventId: z.string().uuid(),
});

export const registerFreeSchema = z.object({
  eventId: z.string().uuid(),
  ticketTypeId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  customFieldValues: z.record(z.string(), z.string()).optional(),
});

export const createCheckoutSchema = z.object({
  eventId: z.string().uuid(),
  ticketTypeId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  customFieldValues: z.record(z.string(), z.string()).optional(),
});

export type SaveRegistrationConfigInput = z.infer<typeof saveRegistrationConfigSchema>;
export type SuggestRegistrationFieldsInput = z.infer<typeof suggestRegistrationFieldsSchema>;
export type RegisterFreeInput = z.infer<typeof registerFreeSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
