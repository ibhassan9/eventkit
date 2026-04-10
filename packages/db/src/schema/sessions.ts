import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { sessionSpeakers } from "./session-speakers";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    startTime: timestamp({ withTimezone: true }).notNull(),
    endTime: timestamp({ withTimezone: true }).notNull(),
    location: text(),
    track: text(),
    capacity: integer(),
    sortOrder: integer().notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("sessions_event_id_idx").on(table.eventId)]
);

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  event: one(events, {
    fields: [sessions.eventId],
    references: [events.id],
  }),
  sessionSpeakers: many(sessionSpeakers),
}));
