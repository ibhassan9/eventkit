import { eq } from "drizzle-orm";
import { db } from "../client";
import { users } from "../schema";

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
}) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function updateUserPassword(
  id: string,
  data: {
    passwordHash: string;
    mustChangePassword: boolean;
    temporaryPassword?: string | null;
  }
) {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function updateUserLastLogin(id: string) {
  await db
    .update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, id));
}
