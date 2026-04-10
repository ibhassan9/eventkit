import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, attendees } from "@/db/schema";
import type { RegistrationConfig, WebsiteConfig } from "@/types";

export async function getEventsByOrgId(organizationId: string) {
  return db.query.events.findMany({
    where: eq(events.organizationId, organizationId),
    orderBy: desc(events.startDate),
    with: { ticketTypes: true },
  });
}

export async function getEventsWithCountsByOrgId(organizationId: string) {
  return db.query.events.findMany({
    where: eq(events.organizationId, organizationId),
    orderBy: desc(events.startDate),
    with: { ticketTypes: true, attendees: { columns: { id: true } } },
  });
}

export async function getEventById(id: string) {
  return db.query.events.findFirst({
    where: eq(events.id, id),
    with: { ticketTypes: true },
  });
}

export async function getEventBySlug(slug: string) {
  return db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: { ticketTypes: true },
  });
}

export async function getEventWithStats(eventId: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: { ticketTypes: true, attendees: true },
  });
  if (!event) return null;

  const totalAttendees = event.attendees.length;
  const checkedIn = event.attendees.filter((a) => a.checkedInAt).length;
  const totalRevenue = event.attendees.reduce(
    (sum, a) => sum + a.amountPaid,
    0
  );

  return { ...event, totalAttendees, checkedIn, totalRevenue };
}

export async function createEvent(data: {
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  venue?: string;
  address?: string;
  startDate: Date;
  endDate: Date;
  timezone?: string;
  currency?: string;
}) {
  const [event] = await db.insert(events).values(data).returning();
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string | null;
    venue: string | null;
    address: string | null;
    startDate: Date;
    endDate: Date;
    timezone: string;
    currency: string;
    status: "draft" | "published" | "completed" | "cancelled";
    websiteConfig: WebsiteConfig | null;
    registrationFields: RegistrationConfig | null;
    maxAttendees: number | null;
  }>
) {
  const [event] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();
  return event;
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
}

export async function getEventAttendeeCount(eventId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(attendees)
    .where(eq(attendees.eventId, eventId));
  return result[0]?.count ?? 0;
}
