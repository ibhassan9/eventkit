"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  getEventById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "@eventkit/db/queries";

const saveSchema = z.object({
  eventId: z.string().uuid(),
  speakerId: z.string().uuid().optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  headshotUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
});

export const saveSpeaker = createSafeAction(saveSchema, async (input, ctx) => {
  const event = await getEventById(input.eventId);
  if (!event || event.organizationId !== ctx.organizationId) {
    throw new Error("Event not found");
  }

  if (input.speakerId) {
    const updated = await updateSpeaker(input.speakerId, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email || null,
      title: input.title || null,
      company: input.company || null,
      bio: input.bio || null,
      headshotUrl: input.headshotUrl || null,
      websiteUrl: input.websiteUrl || null,
      linkedinUrl: input.linkedinUrl || null,
      twitterUrl: input.twitterUrl || null,
    });
    revalidatePath(`/events/${input.eventId}/speakers`);
    return updated;
  }

  const created = await createSpeaker({
    eventId: input.eventId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email || undefined,
    title: input.title || undefined,
    company: input.company || undefined,
    bio: input.bio || undefined,
    headshotUrl: input.headshotUrl || undefined,
    websiteUrl: input.websiteUrl || undefined,
    linkedinUrl: input.linkedinUrl || undefined,
    twitterUrl: input.twitterUrl || undefined,
  });
  revalidatePath(`/events/${input.eventId}/speakers`);
  return created;
});

const deleteSchema = z.object({
  eventId: z.string().uuid(),
  speakerId: z.string().uuid(),
});

export const deleteSpeakerAction = createSafeAction(
  deleteSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    await deleteSpeaker(input.speakerId);
    revalidatePath(`/events/${input.eventId}/speakers`);
  }
);
