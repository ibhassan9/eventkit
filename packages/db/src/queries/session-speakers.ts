import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { sessionSpeakers } from "../schema";

export async function assignSpeakerToSession(data: {
  sessionId: string;
  speakerId: string;
  role?: "speaker" | "moderator" | "panelist";
  sortOrder?: number;
}) {
  const [assignment] = await db
    .insert(sessionSpeakers)
    .values(data)
    .returning();
  return assignment;
}

export async function unassignSpeakerFromSession(
  sessionId: string,
  speakerId: string
) {
  await db
    .delete(sessionSpeakers)
    .where(
      and(
        eq(sessionSpeakers.sessionId, sessionId),
        eq(sessionSpeakers.speakerId, speakerId)
      )
    );
}

export async function replaceSessionSpeakers(
  sessionId: string,
  speakerAssignments: {
    speakerId: string;
    role: "speaker" | "moderator" | "panelist";
    sortOrder: number;
  }[]
) {
  await db
    .delete(sessionSpeakers)
    .where(eq(sessionSpeakers.sessionId, sessionId));

  if (speakerAssignments.length === 0) return [];

  return db
    .insert(sessionSpeakers)
    .values(speakerAssignments.map((a) => ({ ...a, sessionId })))
    .returning();
}

export async function updateSessionSpeakerRole(
  sessionId: string,
  speakerId: string,
  data: Partial<{
    role: "speaker" | "moderator" | "panelist";
    sortOrder: number;
  }>
) {
  const [assignment] = await db
    .update(sessionSpeakers)
    .set(data)
    .where(
      and(
        eq(sessionSpeakers.sessionId, sessionId),
        eq(sessionSpeakers.speakerId, speakerId)
      )
    )
    .returning();
  return assignment;
}
