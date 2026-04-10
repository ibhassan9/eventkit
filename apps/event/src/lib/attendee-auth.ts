import { cookies } from "next/headers";
import {
  createDbAttendeeSession,
  getSessionByToken,
  deleteSessionByToken,
  getUserById,
  getAttendeeByUserAndEvent,
} from "@eventkit/db/queries";

const COOKIE_NAME = "eventkit_attendee_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createAttendeeSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await createDbAttendeeSession({ userId, token, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function getAttendeeUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await getSessionByToken(token);
  if (!session || new Date() > session.expiresAt) return null;

  const user = await getUserById(session.userId);
  return user ?? null;
}

export async function destroyAttendeeSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await deleteSessionByToken(token);
  }
  cookieStore.delete(COOKIE_NAME);
}

export async function getAttendeeForEvent(userId: string, eventId: string) {
  const result = await getAttendeeByUserAndEvent(userId, eventId);
  return result ?? null;
}
