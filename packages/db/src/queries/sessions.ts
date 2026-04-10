import { eq, asc, inArray } from "drizzle-orm";
import { db } from "../client";
import { sessions } from "../schema";

export async function getSessionsByEventId(eventId: string) {
  return db.query.sessions.findMany({
    where: eq(sessions.eventId, eventId),
    orderBy: asc(sessions.startTime),
    with: {
      sessionSpeakers: {
        with: { speaker: true },
        orderBy: (sessionSpeakers, { asc }) => [asc(sessionSpeakers.sortOrder)],
      },
    },
  });
}

export async function getSessionById(id: string) {
  return db.query.sessions.findFirst({
    where: eq(sessions.id, id),
    with: {
      sessionSpeakers: {
        with: { speaker: true },
        orderBy: (sessionSpeakers, { asc }) => [asc(sessionSpeakers.sortOrder)],
      },
    },
  });
}

export async function createSession(data: {
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  track?: string;
  capacity?: number;
  sortOrder?: number;
}) {
  const [session] = await db.insert(sessions).values(data).returning();
  return session;
}

export async function updateSession(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    location: string | null;
    track: string | null;
    capacity: number | null;
    sortOrder: number;
  }>
) {
  const [session] = await db
    .update(sessions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(sessions.id, id))
    .returning();
  return session;
}

export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id));
}

export async function deleteSessions(ids: string[]) {
  if (ids.length === 0) return;
  await db.delete(sessions).where(inArray(sessions.id, ids));
}
