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

export const speakers = pgTable(
  "speakers",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    firstName: text().notNull(),
    lastName: text().notNull(),
    email: text(),
    title: text(),
    company: text(),
    bio: text(),
    headshotUrl: text(),
    websiteUrl: text(),
    linkedinUrl: text(),
    twitterUrl: text(),
    sortOrder: integer().notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("speakers_event_id_idx").on(table.eventId)]
);

export const speakersRelations = relations(speakers, ({ one, many }) => ({
  event: one(events, {
    fields: [speakers.eventId],
    references: [events.id],
  }),
  sessionSpeakers: many(sessionSpeakers),
}));
