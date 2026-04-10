import { z } from "zod";

export const paymentStatusValues = [
  "pending",
  "paid",
  "free",
  "refunded",
] as const;

export const registerAttendeeSchema = z.object({
  eventId: z.string().uuid(),
  ticketTypeId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
  customFieldValues: z.record(z.string(), z.string()).optional(),
});

export const updateAttendeeSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  company: z.string().max(200).optional().nullable(),
  jobTitle: z.string().max(200).optional().nullable(),
});

export type RegisterAttendeeInput = z.infer<typeof registerAttendeeSchema>;
export type UpdateAttendeeInput = z.infer<typeof updateAttendeeSchema>;
