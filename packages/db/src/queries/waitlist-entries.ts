import { eq, and, sql, asc, desc, lt } from "drizzle-orm";
import { db } from "../client";
import { waitlistEntries, ticketTypes } from "../schema";

export async function getWaitlistEntriesByTicketType(
  ticketTypeId: string,
  options?: { status?: string; limit?: number; offset?: number }
) {
  const conditions = [eq(waitlistEntries.ticketTypeId, ticketTypeId)];

  if (options?.status) {
    conditions.push(
      eq(
        waitlistEntries.status,
        options.status as "waiting" | "offered" | "accepted" | "expired" | "cancelled"
      )
    );
  }

  const query = db
    .select()
    .from(waitlistEntries)
    .where(and(...conditions))
    .orderBy(asc(waitlistEntries.position));

  if (options?.limit) query.limit(options.limit);
  if (options?.offset) query.offset(options.offset);

  return query;
}

export async function getWaitlistEntriesByEvent(
  eventId: string,
  options?: { status?: string; limit?: number; offset?: number }
) {
  const conditions = [eq(waitlistEntries.eventId, eventId)];

  if (options?.status) {
    conditions.push(
      eq(
        waitlistEntries.status,
        options.status as "waiting" | "offered" | "accepted" | "expired" | "cancelled"
      )
    );
  }

  return db.query.waitlistEntries.findMany({
    where: and(...conditions),
    with: { ticketType: true },
    orderBy: [asc(waitlistEntries.position)],
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function getWaitlistEntryByEmailAndTicketType(
  email: string,
  ticketTypeId: string
) {
  return db.query.waitlistEntries.findFirst({
    where: and(
      eq(waitlistEntries.email, email),
      eq(waitlistEntries.ticketTypeId, ticketTypeId)
    ),
  });
}

export async function getNextWaitlistPosition(
  ticketTypeId: string
): Promise<number> {
  const result = await db
    .select({
      maxPosition: sql<number>`coalesce(max(${waitlistEntries.position}), 0)::int`,
    })
    .from(waitlistEntries)
    .where(eq(waitlistEntries.ticketTypeId, ticketTypeId));

  return (result[0]?.maxPosition ?? 0) + 1;
}

export async function createWaitlistEntry(data: {
  eventId: string;
  ticketTypeId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: number;
}) {
  const [entry] = await db.insert(waitlistEntries).values(data).returning();
  return entry;
}

export async function getWaitlistEntryById(id: string) {
  return db.query.waitlistEntries.findFirst({
    where: eq(waitlistEntries.id, id),
    with: { ticketType: true, event: true },
  });
}

export async function offerWaitlistSpot(
  entryId: string,
  expiresInHours: number = 48
) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const [entry] = await db
    .update(waitlistEntries)
    .set({
      status: "offered",
      offeredAt: new Date(),
      offerExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(waitlistEntries.id, entryId))
    .returning();
  return entry;
}

export async function acceptWaitlistOffer(
  entryId: string,
  attendeeId: string
) {
  const [entry] = await db
    .update(waitlistEntries)
    .set({
      status: "accepted",
      convertedAttendeeId: attendeeId,
      updatedAt: new Date(),
    })
    .where(eq(waitlistEntries.id, entryId))
    .returning();
  return entry;
}

export async function cancelWaitlistEntry(entryId: string) {
  const [entry] = await db
    .update(waitlistEntries)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(eq(waitlistEntries.id, entryId))
    .returning();
  return entry;
}

export async function expireWaitlistOffers() {
  const expired = await db
    .update(waitlistEntries)
    .set({
      status: "expired",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(waitlistEntries.status, "offered"),
        lt(waitlistEntries.offerExpiresAt, new Date())
      )
    )
    .returning();
  return expired;
}

export async function getNextWaitingEntry(ticketTypeId: string) {
  return db.query.waitlistEntries.findFirst({
    where: and(
      eq(waitlistEntries.ticketTypeId, ticketTypeId),
      eq(waitlistEntries.status, "waiting")
    ),
    orderBy: [asc(waitlistEntries.position)],
  });
}

export async function getWaitlistStats(eventId: string) {
  const result = await db
    .select({
      total: sql<number>`count(*)::int`,
      waiting: sql<number>`count(*) filter (where ${waitlistEntries.status} = 'waiting')::int`,
      offered: sql<number>`count(*) filter (where ${waitlistEntries.status} = 'offered')::int`,
      accepted: sql<number>`count(*) filter (where ${waitlistEntries.status} = 'accepted')::int`,
      expired: sql<number>`count(*) filter (where ${waitlistEntries.status} = 'expired')::int`,
      cancelled: sql<number>`count(*) filter (where ${waitlistEntries.status} = 'cancelled')::int`,
    })
    .from(waitlistEntries)
    .where(eq(waitlistEntries.eventId, eventId));

  return (
    result[0] ?? {
      total: 0,
      waiting: 0,
      offered: 0,
      accepted: 0,
      expired: 0,
      cancelled: 0,
    }
  );
}

export async function getWaitlistCountsByTicketType(eventId: string) {
  return db
    .select({
      ticketTypeId: waitlistEntries.ticketTypeId,
      count: sql<number>`count(*) filter (where ${waitlistEntries.status} in ('waiting', 'offered'))::int`,
    })
    .from(waitlistEntries)
    .where(eq(waitlistEntries.eventId, eventId))
    .groupBy(waitlistEntries.ticketTypeId);
}

export async function cancelAllWaitlistEntriesByEvent(eventId: string) {
  return db
    .update(waitlistEntries)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(waitlistEntries.eventId, eventId),
        sql`${waitlistEntries.status} in ('waiting', 'offered')`
      )
    )
    .returning();
}
