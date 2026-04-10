import { z } from "zod";

export const createTicketTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().int().min(0, "Price must be 0 or greater"),
  capacity: z.number().int().positive().optional(),
  salesStart: z.coerce.date().optional(),
  salesEnd: z.coerce.date().optional(),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export const updateTicketTypeSchema = createTicketTypeSchema.partial();

export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>;
export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>;
