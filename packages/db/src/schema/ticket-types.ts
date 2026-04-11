import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { attendees } from "./attendees";
import { orderItems } from "./orders";

export const ticketTypes = pgTable(
  "ticket_types",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    price: integer().notNull().default(0),
    capacity: integer(),
    soldCount: integer().notNull().default(0),
    salesStart: timestamp({ withTimezone: true }),
    salesEnd: timestamp({ withTimezone: true }),
    sortOrder: integer().notNull().default(0),
    isVisible: boolean().notNull().default(true),
    allowWaitlist: boolean().notNull().default(false),
    minPerOrder: integer().notNull().default(1),
    maxPerOrder: integer().notNull().default(10),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("ticket_types_event_id_idx").on(table.eventId),
    index("ticket_types_event_sort_idx").on(table.eventId, table.sortOrder),
  ]
);

export const ticketTypesRelations = relations(ticketTypes, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTypes.eventId],
    references: [events.id],
  }),
  attendees: many(attendees),
  orderItems: many(orderItems),
}));
