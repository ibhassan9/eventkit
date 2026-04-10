CREATE TYPE "public"."email_send_status" AS ENUM('draft', 'sending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."email_type" AS ENUM('confirmation', 'reminder', 'update', 'custom');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'free', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."speaker_role" AS ENUM('speaker', 'moderator', 'panelist');--> statement-breakpoint
CREATE TABLE "attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"job_title" text,
	"custom_field_values" jsonb DEFAULT '{}'::jsonb,
	"stripe_payment_intent_id" text,
	"stripe_checkout_session_id" text,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"checked_in_at" timestamp with time zone,
	"checked_in_by" text,
	"badge_printed_at" timestamp with time zone,
	"qr_code" text NOT NULL,
	"confirmation_email_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attendees_qrCode_unique" UNIQUE("qr_code")
);
--> statement-breakpoint
CREATE TABLE "badge_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"config" jsonb NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_sends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_template_id" uuid,
	"event_id" uuid NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"status" "email_send_status" DEFAULT 'draft' NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"type" "email_type" DEFAULT 'custom' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"venue" text,
	"address" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"timezone" text DEFAULT 'America/Toronto' NOT NULL,
	"currency" text DEFAULT 'CAD' NOT NULL,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"website_config" jsonb,
	"website_pages" jsonb,
	"registration_fields" jsonb,
	"max_attendees" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"clerk_user_id" text NOT NULL,
	"stripe_account_id" text,
	"stripe_onboarding_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session_speakers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"speaker_id" uuid NOT NULL,
	"role" "speaker_role" DEFAULT 'speaker' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"location" text,
	"track" text,
	"capacity" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speakers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"title" text,
	"company" text,
	"bio" text,
	"headshot_url" text,
	"website_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer DEFAULT 0 NOT NULL,
	"capacity" integer,
	"sales_start" timestamp with time zone,
	"sales_end" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badge_templates" ADD CONSTRAINT "badge_templates_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_sends" ADD CONSTRAINT "email_sends_email_template_id_email_templates_id_fk" FOREIGN KEY ("email_template_id") REFERENCES "public"."email_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_sends" ADD CONSTRAINT "email_sends_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_speakers" ADD CONSTRAINT "session_speakers_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_speakers" ADD CONSTRAINT "session_speakers_speaker_id_speakers_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attendees_event_id_idx" ON "attendees" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attendees_email_event_idx" ON "attendees" USING btree ("email","event_id");--> statement-breakpoint
CREATE INDEX "attendees_qr_code_idx" ON "attendees" USING btree ("qr_code");--> statement-breakpoint
CREATE INDEX "badge_templates_event_id_idx" ON "badge_templates" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "email_sends_event_id_idx" ON "email_sends" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "email_templates_event_id_idx" ON "email_templates" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "events_org_id_idx" ON "events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "session_speakers_session_speaker_idx" ON "session_speakers" USING btree ("session_id","speaker_id");--> statement-breakpoint
CREATE INDEX "sessions_event_id_idx" ON "sessions" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "speakers_event_id_idx" ON "speakers" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "ticket_types_event_id_idx" ON "ticket_types" USING btree ("event_id");