import { eq } from "drizzle-orm";
import { db } from "../client";
import { attendeeSessions } from "../schema";

export async function createDbAttendeeSession(data: {
  userId: string;
  token: string;
  expiresAt: Date;
}) {
  const [session] = await db
    .insert(attendeeSessions)
    .values(data)
    .returning();
  return session;
}

export async function getSessionByToken(token: string) {
  return db.query.attendeeSessions.findFirst({
    where: eq(attendeeSessions.token, token),
  });
}

export async function deleteSessionByToken(token: string) {
  await db
    .delete(attendeeSessions)
    .where(eq(attendeeSessions.token, token));
}
