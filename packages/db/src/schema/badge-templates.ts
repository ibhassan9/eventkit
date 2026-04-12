import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import type { AnyBadgeConfig } from "@eventkit/types";

export const badgeTemplates = pgTable(
  "badge_templates",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text().notNull(),
    config: jsonb().notNull().$type<AnyBadgeConfig>(),
    isDefault: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("badge_templates_event_id_idx").on(table.eventId)]
);

export const badgeTemplatesRelations = relations(
  badgeTemplates,
  ({ one }) => ({
    event: one(events, {
      fields: [badgeTemplates.eventId],
      references: [events.id],
    }),
  })
);
