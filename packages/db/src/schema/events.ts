import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { organizations } from "./organizations";
import { ticketTypes } from "./ticket-types";
import { attendees } from "./attendees";
import { emailTemplates } from "./email-templates";
import { badgeTemplates } from "./badge-templates";
import { sessions } from "./sessions";
import { speakers } from "./speakers";
import type { RegistrationConfig, WebsiteConfig, WebsitePages } from "@eventkit/types";

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "completed",
  "cancelled",
]);

export const events = pgTable(
  "events",
  {
    id: uuid().primaryKey().defaultRandom(),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    venue: text(),
    address: text(),
    startDate: timestamp({ withTimezone: true }).notNull(),
    endDate: timestamp({ withTimezone: true }).notNull(),
    timezone: text().notNull().default("America/Toronto"),
    currency: text().notNull().default("CAD"),
    status: eventStatusEnum().notNull().default("draft"),
    websiteConfig: jsonb().$type<WebsiteConfig>(),
    websitePages: jsonb().$type<WebsitePages>(),
    registrationFields: jsonb().$type<RegistrationConfig>(),
    maxAttendees: integer(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("events_org_id_idx").on(table.organizationId),
    index("events_slug_idx").on(table.slug),
    index("events_status_idx").on(table.status),
  ]
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
  ticketTypes: many(ticketTypes),
  attendees: many(attendees),
  emailTemplates: many(emailTemplates),
  badgeTemplates: many(badgeTemplates),
  sessions: many(sessions),
  speakers: many(speakers),
}));
