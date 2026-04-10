import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { ticketTypes } from "./ticket-types";
import { users } from "./users";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "free",
  "refunded",
]);

export const attendees = pgTable(
  "attendees",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    ticketTypeId: uuid()
      .notNull()
      .references(() => ticketTypes.id),
    userId: uuid().references(() => users.id, { onDelete: "set null" }),
    firstName: text().notNull(),
    lastName: text().notNull(),
    email: text().notNull(),
    company: text(),
    jobTitle: text(),
    customFieldValues: jsonb().$type<Record<string, string>>().default({}),
    stripePaymentIntentId: text(),
    stripeCheckoutSessionId: text(),
    paymentStatus: paymentStatusEnum().notNull().default("pending"),
    amountPaid: integer().notNull().default(0),
    checkedInAt: timestamp({ withTimezone: true }),
    checkedInBy: text(),
    badgePrintedAt: timestamp({ withTimezone: true }),
    qrCode: text().notNull().unique(),
    confirmationEmailSentAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("attendees_event_id_idx").on(table.eventId),
    uniqueIndex("attendees_email_event_idx").on(table.email, table.eventId),
    index("attendees_qr_code_idx").on(table.qrCode),
    index("attendees_user_id_idx").on(table.userId),
  ]
);

export const attendeesRelations = relations(attendees, ({ one }) => ({
  event: one(events, {
    fields: [attendees.eventId],
    references: [events.id],
  }),
  ticketType: one(ticketTypes, {
    fields: [attendees.ticketTypeId],
    references: [ticketTypes.id],
  }),
  user: one(users, {
    fields: [attendees.userId],
    references: [users.id],
  }),
}));
