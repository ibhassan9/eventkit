"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import {
  getEventById,
  createSession,
  updateSession,
  deleteSession,
  deleteSessions,
  replaceSessionSpeakers,
} from "@eventkit/db/queries";

const speakerAssignmentSchema = z.object({
  speakerId: z.string().uuid(),
  role: z.enum(["speaker", "moderator", "panelist"]),
  sortOrder: z.number().int().min(0),
});

const saveSchema = z.object({
  eventId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().optional(),
  track: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  speakers: z.array(speakerAssignmentSchema).optional(),
});

export const saveSession = createSafeAction(saveSchema, async (input, ctx) => {
  const event = await getEventById(input.eventId);
  if (!event || event.organizationId !== ctx.organizationId) {
    throw new Error("Event not found");
  }

  let session;
  if (input.sessionId) {
    session = await updateSession(input.sessionId, {
      title: input.title,
      description: input.description || null,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      location: input.location || null,
      track: input.track || null,
      capacity: input.capacity ?? null,
    });
  } else {
    session = await createSession({
      eventId: input.eventId,
      title: input.title,
      description: input.description || undefined,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      location: input.location || undefined,
      track: input.track || undefined,
      capacity: input.capacity,
    });
  }

  if (input.speakers && session) {
    await replaceSessionSpeakers(session.id, input.speakers);
  }

  revalidatePath(`/events/${input.eventId}/schedule`);
  return session;
});

const deleteSchema = z.object({
  eventId: z.string().uuid(),
  sessionId: z.string().uuid(),
});

export const deleteSessionAction = createSafeAction(
  deleteSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    await deleteSession(input.sessionId);
    revalidatePath(`/events/${input.eventId}/schedule`);
  }
);

const bulkDeleteSchema = z.object({
  eventId: z.string().uuid(),
  sessionIds: z.array(z.string().uuid()).min(1),
});

export const bulkDeleteSessionsAction = createSafeAction(
  bulkDeleteSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    await deleteSessions(input.sessionIds);
    revalidatePath(`/events/${input.eventId}/schedule`);
  }
);
