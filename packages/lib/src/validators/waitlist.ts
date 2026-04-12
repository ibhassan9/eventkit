import { z } from "zod";

export const joinWaitlistSchema = z.object({
  eventId: z.string().uuid(),
  ticketTypeId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export const offerWaitlistSpotSchema = z.object({
  eventId: z.string().uuid(),
  entryId: z.string().uuid(),
  expiresInHours: z.number().int().min(1).max(168).default(48),
});

export const cancelWaitlistEntrySchema = z.object({
  eventId: z.string().uuid(),
  entryId: z.string().uuid(),
});

export const acceptWaitlistOfferSchema = z.object({
  entryId: z.string().uuid(),
  token: z.string().min(1),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;
export type OfferWaitlistSpotInput = z.infer<typeof offerWaitlistSpotSchema>;
export type CancelWaitlistEntryInput = z.infer<typeof cancelWaitlistEntrySchema>;
export type AcceptWaitlistOfferInput = z.infer<typeof acceptWaitlistOfferSchema>;
