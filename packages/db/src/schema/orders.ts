import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { attendees } from "./attendees";
import { ticketTypes } from "./ticket-types";

export const orderPaymentStatusEnum = pgEnum("order_payment_status", [
  "pending",
  "paid",
  "free",
  "refunded",
  "partially_refunded",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    attendeeId: uuid()
      .notNull()
      .references(() => attendees.id, { onDelete: "cascade" }),
    stripeCheckoutSessionId: text(),
    stripePaymentIntentId: text(),
    paymentStatus: orderPaymentStatusEnum().notNull().default("pending"),
    totalAmount: integer().notNull().default(0),
    currency: text().notNull().default("CAD"),
    refundedAmount: integer().notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("orders_event_id_idx").on(table.eventId),
    index("orders_attendee_id_idx").on(table.attendeeId),
    index("orders_stripe_checkout_session_idx").on(
      table.stripeCheckoutSessionId
    ),
    index("orders_stripe_payment_intent_idx").on(table.stripePaymentIntentId),
  ]
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  event: one(events, {
    fields: [orders.eventId],
    references: [events.id],
  }),
  attendee: one(attendees, {
    fields: [orders.attendeeId],
    references: [attendees.id],
  }),
  items: many(orderItems),
}));

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid().primaryKey().defaultRandom(),
    orderId: uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    ticketTypeId: uuid()
      .notNull()
      .references(() => ticketTypes.id, { onDelete: "restrict" }),
    quantity: integer().notNull().default(1),
    unitPrice: integer().notNull(),
    subtotal: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_ticket_type_id_idx").on(table.ticketTypeId),
  ]
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  ticketType: one(ticketTypes, {
    fields: [orderItems.ticketTypeId],
    references: [ticketTypes.id],
  }),
}));
