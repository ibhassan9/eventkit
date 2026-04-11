import { eq, and, or, ilike, sql, desc } from "drizzle-orm";
import { db } from "../client";
import { attendees } from "../schema";

export async function getAttendeesByEventId(
  eventId: string,
  options?: {
    search?: string;
    paymentStatus?: string;
    ticketTypeId?: string;
    checkedIn?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  const conditions = [eq(attendees.eventId, eventId)];

  if (options?.search) {
    const term = `%${options.search}%`;
    conditions.push(
      or(
        ilike(attendees.firstName, term),
        ilike(attendees.lastName, term),
        ilike(attendees.email, term)
      )!
    );
  }

  if (options?.paymentStatus) {
    conditions.push(
      eq(attendees.paymentStatus, options.paymentStatus as "pending" | "paid" | "free" | "refunded")
    );
  }

  if (options?.ticketTypeId) {
    conditions.push(eq(attendees.ticketTypeId, options.ticketTypeId));
  }

  if (options?.checkedIn === true) {
    conditions.push(sql`${attendees.checkedInAt} IS NOT NULL`);
  } else if (options?.checkedIn === false) {
    conditions.push(sql`${attendees.checkedInAt} IS NULL`);
  }

  const query = db
    .select()
    .from(attendees)
    .where(and(...conditions))
    .orderBy(desc(attendees.createdAt));

  if (options?.limit) {
    query.limit(options.limit);
  }
  if (options?.offset) {
    query.offset(options.offset);
  }

  return query;
}

export async function getAttendeeById(id: string) {
  return db.query.attendees.findFirst({
    where: eq(attendees.id, id),
    with: {
      ticketType: true,
      orders: {
        with: {
          items: { with: { ticketType: true } },
        },
      },
    },
  });
}

export async function getAttendeeByQrCode(qrCode: string) {
  return db.query.attendees.findFirst({
    where: eq(attendees.qrCode, qrCode),
    with: { ticketType: true, event: true },
  });
}

export async function getAttendeeByEmail(email: string, eventId: string) {
  return db.query.attendees.findFirst({
    where: and(eq(attendees.email, email), eq(attendees.eventId, eventId)),
  });
}

export async function getAttendeeByUserAndEvent(userId: string, eventId: string) {
  return db.query.attendees.findFirst({
    where: and(eq(attendees.userId, userId), eq(attendees.eventId, eventId)),
    with: { ticketType: true },
  });
}

export async function createAttendee(data: {
  eventId: string;
  ticketTypeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  jobTitle?: string;
  customFieldValues?: Record<string, string>;
  paymentStatus?: "pending" | "paid" | "free" | "refunded";
  amountPaid?: number;
  qrCode: string;
  stripeCheckoutSessionId?: string;
  userId?: string;
}) {
  const [attendee] = await db.insert(attendees).values(data).returning();
  return attendee;
}

export async function getAttendeesByUserId(userId: string) {
  return db.query.attendees.findMany({
    where: eq(attendees.userId, userId),
    with: { event: true, ticketType: true },
  });
}

export async function updateAttendee(
  id: string,
  data: Partial<{
    paymentStatus: "pending" | "paid" | "free" | "refunded";
    amountPaid: number;
    stripePaymentIntentId: string;
    stripeCheckoutSessionId: string;
    checkedInAt: Date | null;
    checkedInBy: string | null;
    badgePrintedAt: Date;
    confirmationEmailSentAt: Date;
    userId: string;
  }>
) {
  const [attendee] = await db
    .update(attendees)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(attendees.id, id))
    .returning();
  return attendee;
}

export async function checkInAttendee(id: string, checkedInBy: string) {
  const [attendee] = await db
    .update(attendees)
    .set({
      checkedInAt: new Date(),
      checkedInBy,
      updatedAt: new Date(),
    })
    .where(eq(attendees.id, id))
    .returning();
  return attendee;
}

export async function getAttendeeByStripeSession(sessionId: string) {
  return db.query.attendees.findFirst({
    where: eq(attendees.stripeCheckoutSessionId, sessionId),
    with: { ticketType: true, event: true },
  });
}

export async function getAttendeeByPaymentIntent(paymentIntentId: string) {
  return db.query.attendees.findFirst({
    where: eq(attendees.stripePaymentIntentId, paymentIntentId),
    with: { ticketType: true, event: true },
  });
}

export async function getCheckinStats(eventId: string) {
  const result = await db
    .select({
      total: sql<number>`count(*)::int`,
      checkedIn: sql<number>`count(${attendees.checkedInAt})::int`,
    })
    .from(attendees)
    .where(eq(attendees.eventId, eventId));

  const { total, checkedIn } = result[0] ?? { total: 0, checkedIn: 0 };
  return { total, checkedIn, remaining: total - checkedIn };
}
