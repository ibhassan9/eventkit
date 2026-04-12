import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { ticketTypes } from "./ticket-types";
import { attendees } from "./attendees";

export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "waiting",
  "offered",
  "accepted",
  "expired",
  "cancelled",
]);

export const waitlistEntries = pgTable(
  "waitlist_entries",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    ticketTypeId: uuid()
      .notNull()
      .references(() => ticketTypes.id, { onDelete: "cascade" }),
    firstName: text().notNull(),
    lastName: text().notNull(),
    email: text().notNull(),
    position: integer().notNull(),
    status: waitlistStatusEnum().notNull().default("waiting"),
    offeredAt: timestamp({ withTimezone: true }),
    offerExpiresAt: timestamp({ withTimezone: true }),
    convertedAttendeeId: uuid().references(() => attendees.id),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("waitlist_entries_event_id_idx").on(table.eventId),
    index("waitlist_entries_ticket_type_id_idx").on(table.ticketTypeId),
    index("waitlist_entries_status_idx").on(table.status),
    uniqueIndex("waitlist_entries_email_ticket_type_idx").on(
      table.email,
      table.ticketTypeId
    ),
  ]
);

export const waitlistEntriesRelations = relations(
  waitlistEntries,
  ({ one }) => ({
    event: one(events, {
      fields: [waitlistEntries.eventId],
      references: [events.id],
    }),
    ticketType: one(ticketTypes, {
      fields: [waitlistEntries.ticketTypeId],
      references: [ticketTypes.id],
    }),
    convertedAttendee: one(attendees, {
      fields: [waitlistEntries.convertedAttendeeId],
      references: [attendees.id],
    }),
  })
);
