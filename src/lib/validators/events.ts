import { z } from "zod";

export const eventStatusValues = [
  "draft",
  "published",
  "completed",
  "cancelled",
] as const;

export const createEventSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    description: z.string().max(5000).optional(),
    venue: z.string().max(200).optional(),
    address: z.string().max(500).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    timezone: z.string().default("America/Toronto"),
    currency: z.string().default("CAD"),
    maxAttendees: z.number().int().positive().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const updateEventSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  venue: z.string().max(200).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  status: z.enum(eventStatusValues).optional(),
  maxAttendees: z.number().int().positive().optional().nullable(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
