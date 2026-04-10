import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { attendees } from "./attendees";
import { attendeeSessions } from "./attendee-sessions";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  temporaryPassword: text(),
  mustChangePassword: boolean().notNull().default(true),
  lastLoginAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  attendees: many(attendees),
  attendeeSessions: many(attendeeSessions),
}));
