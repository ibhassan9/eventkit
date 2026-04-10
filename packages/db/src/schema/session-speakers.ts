import {
  integer,
  pgEnum,
  pgTable,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sessions } from "./sessions";
import { speakers } from "./speakers";

export const speakerRoleEnum = pgEnum("speaker_role", [
  "speaker",
  "moderator",
  "panelist",
]);

export const sessionSpeakers = pgTable(
  "session_speakers",
  {
    id: uuid().primaryKey().defaultRandom(),
    sessionId: uuid()
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    speakerId: uuid()
      .notNull()
      .references(() => speakers.id, { onDelete: "cascade" }),
    role: speakerRoleEnum().notNull().default("speaker"),
    sortOrder: integer().notNull().default(0),
  },
  (table) => [
    uniqueIndex("session_speakers_session_speaker_idx").on(
      table.sessionId,
      table.speakerId
    ),
  ]
);

export const sessionSpeakersRelations = relations(
  sessionSpeakers,
  ({ one }) => ({
    session: one(sessions, {
      fields: [sessionSpeakers.sessionId],
      references: [sessions.id],
    }),
    speaker: one(speakers, {
      fields: [sessionSpeakers.speakerId],
      references: [speakers.id],
    }),
  })
);
