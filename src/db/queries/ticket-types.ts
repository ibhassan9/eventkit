import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { ticketTypes } from "@/db/schema";

export async function getTicketTypesByEventId(eventId: string) {
  return db.query.ticketTypes.findMany({
    where: eq(ticketTypes.eventId, eventId),
    orderBy: asc(ticketTypes.sortOrder),
  });
}

export async function getTicketTypeById(id: string) {
  return db.query.ticketTypes.findFirst({
    where: eq(ticketTypes.id, id),
  });
}

export async function createTicketType(data: {
  eventId: string;
  name: string;
  description?: string;
  price: number;
  capacity?: number;
  salesStart?: Date;
  salesEnd?: Date;
  sortOrder?: number;
  isVisible?: boolean;
}) {
  const [ticket] = await db.insert(ticketTypes).values(data).returning();
  return ticket;
}

export async function updateTicketType(
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    price: number;
    capacity: number | null;
    salesStart: Date | null;
    salesEnd: Date | null;
    sortOrder: number;
    isVisible: boolean;
  }>
) {
  const [ticket] = await db
    .update(ticketTypes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ticketTypes.id, id))
    .returning();
  return ticket;
}

export async function deleteTicketType(id: string) {
  await db.delete(ticketTypes).where(eq(ticketTypes.id, id));
}
