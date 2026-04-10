import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const attendeeSessions = pgTable(
  "attendee_sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text().notNull().unique(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("attendee_sessions_token_idx").on(table.token)]
);

export const attendeeSessionsRelations = relations(
  attendeeSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [attendeeSessions.userId],
      references: [users.id],
    }),
  })
);
