import { z } from "zod";

export const createTicketTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
  price: z.number().int().min(0, "Price must be 0 or greater"),
  capacity: z.number().int().positive().optional().nullable(),
  salesStart: z.coerce.date().optional().nullable(),
  salesEnd: z.coerce.date().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  allowWaitlist: z.boolean().default(false),
  minPerOrder: z.number().int().min(1).default(1),
  maxPerOrder: z.number().int().min(1).default(10),
});

export const updateTicketTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  price: z.number().int().min(0).optional(),
  capacity: z.number().int().positive().optional().nullable(),
  salesStart: z.coerce.date().optional().nullable(),
  salesEnd: z.coerce.date().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isVisible: z.boolean().optional(),
  allowWaitlist: z.boolean().optional(),
  minPerOrder: z.number().int().min(1).optional(),
  maxPerOrder: z.number().int().min(1).optional(),
});

export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>;
export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>;
