import { eq, asc } from "drizzle-orm";
import { db } from "../client";
import { speakers } from "../schema";

export async function getSpeakersByEventId(eventId: string) {
  return db.query.speakers.findMany({
    where: eq(speakers.eventId, eventId),
    orderBy: asc(speakers.sortOrder),
    with: {
      sessionSpeakers: {
        with: { session: true },
      },
    },
  });
}

export async function getSpeakerById(id: string) {
  return db.query.speakers.findFirst({
    where: eq(speakers.id, id),
    with: {
      sessionSpeakers: {
        with: { session: true },
      },
    },
  });
}

export async function createSpeaker(data: {
  eventId: string;
  firstName: string;
  lastName: string;
  email?: string;
  title?: string;
  company?: string;
  bio?: string;
  headshotUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  sortOrder?: number;
}) {
  const [speaker] = await db.insert(speakers).values(data).returning();
  return speaker;
}

export async function updateSpeaker(
  id: string,
  data: Partial<{
    firstName: string;
    lastName: string;
    email: string | null;
    title: string | null;
    company: string | null;
    bio: string | null;
    headshotUrl: string | null;
    websiteUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    sortOrder: number;
  }>
) {
  const [speaker] = await db
    .update(speakers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(speakers.id, id))
    .returning();
  return speaker;
}

export async function deleteSpeaker(id: string) {
  await db.delete(speakers).where(eq(speakers.id, id));
}
