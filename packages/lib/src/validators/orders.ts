import { z } from "zod";

export const orderPaymentStatusValues = [
  "pending",
  "paid",
  "free",
  "refunded",
  "partially_refunded",
] as const;

export const cartItemSchema = z.object({
  ticketTypeId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const registerCartSchema = z.object({
  eventId: z.string().uuid(),
  items: z.array(cartItemSchema).min(1, "Select at least one ticket"),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  customFieldValues: z.record(z.string(), z.string()).optional(),
});

export const createCartCheckoutSchema = registerCartSchema;

export type CartItem = z.infer<typeof cartItemSchema>;
export type RegisterCartInput = z.infer<typeof registerCartSchema>;
