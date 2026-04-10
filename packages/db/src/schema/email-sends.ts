import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { emailTemplates } from "./email-templates";
import { events } from "./events";

export const emailSendStatusEnum = pgEnum("email_send_status", [
  "draft",
  "sending",
  "sent",
  "failed",
]);

export const emailSends = pgTable(
  "email_sends",
  {
    id: uuid().primaryKey().defaultRandom(),
    emailTemplateId: uuid().references(() => emailTemplates.id),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    recipientCount: integer().notNull().default(0),
    status: emailSendStatusEnum().notNull().default("draft"),
    sentAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("email_sends_event_id_idx").on(table.eventId)]
);

export const emailSendsRelations = relations(emailSends, ({ one }) => ({
  emailTemplate: one(emailTemplates, {
    fields: [emailSends.emailTemplateId],
    references: [emailTemplates.id],
  }),
  event: one(events, {
    fields: [emailSends.eventId],
    references: [events.id],
  }),
}));
