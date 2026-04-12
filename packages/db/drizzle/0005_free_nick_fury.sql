CREATE TYPE "public"."waitlist_status" AS ENUM('waiting', 'offered', 'accepted', 'expired', 'cancelled');--> statement-breakpoint
CREATE TABLE "waitlist_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"position" integer NOT NULL,
	"status" "waitlist_status" DEFAULT 'waiting' NOT NULL,
	"offered_at" timestamp with time zone,
	"offer_expires_at" timestamp with time zone,
	"converted_attendee_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendees" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_converted_attendee_id_attendees_id_fk" FOREIGN KEY ("converted_attendee_id") REFERENCES "public"."attendees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "waitlist_entries_event_id_idx" ON "waitlist_entries" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "waitlist_entries_ticket_type_id_idx" ON "waitlist_entries" USING btree ("ticket_type_id");--> statement-breakpoint
CREATE INDEX "waitlist_entries_status_idx" ON "waitlist_entries" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_entries_email_ticket_type_idx" ON "waitlist_entries" USING btree ("email","ticket_type_id");