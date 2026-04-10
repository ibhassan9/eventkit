import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";

export const emailTypeEnum = pgEnum("email_type", [
  "confirmation",
  "reminder",
  "update",
  "custom",
]);

export const emailTemplates = pgTable(
  "email_templates",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text().notNull(),
    subject: text().notNull(),
    body: text().notNull(),
    type: emailTypeEnum().notNull().default("custom"),
    isActive: boolean().notNull().default(true),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("email_templates_event_id_idx").on(table.eventId)]
);

export const emailTemplatesRelations = relations(
  emailTemplates,
  ({ one }) => ({
    event: one(events, {
      fields: [emailTemplates.eventId],
      references: [events.id],
    }),
  })
);
