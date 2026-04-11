import { eq, and, sql } from "drizzle-orm";
import { db } from "../client";
import { orders, orderItems, ticketTypes } from "../schema";

export async function createOrderWithItems(data: {
  eventId: string;
  attendeeId: string;
  paymentStatus?: "pending" | "paid" | "free" | "refunded" | "partially_refunded";
  currency?: string;
  stripeCheckoutSessionId?: string;
  items: Array<{
    ticketTypeId: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  return db.transaction(async (tx) => {
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const [order] = await tx
      .insert(orders)
      .values({
        eventId: data.eventId,
        attendeeId: data.attendeeId,
        paymentStatus: data.paymentStatus ?? "pending",
        totalAmount,
        currency: data.currency ?? "CAD",
        stripeCheckoutSessionId: data.stripeCheckoutSessionId,
      })
      .returning();

    for (const item of data.items) {
      await tx.insert(orderItems).values({
        orderId: order.id,
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      });

      await tx
        .update(ticketTypes)
        .set({
          soldCount: sql`${ticketTypes.soldCount} + ${item.quantity}`,
        })
        .where(eq(ticketTypes.id, item.ticketTypeId));
    }

    return order;
  });
}

export async function getOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: { with: { ticketType: true } },
      attendee: true,
      event: true,
    },
  });
}

export async function getOrderByAttendeeAndEvent(
  attendeeId: string,
  eventId: string
) {
  return db.query.orders.findFirst({
    where: and(
      eq(orders.attendeeId, attendeeId),
      eq(orders.eventId, eventId)
    ),
    with: {
      items: { with: { ticketType: true } },
    },
  });
}

export async function getOrderByStripeSession(sessionId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.stripeCheckoutSessionId, sessionId),
    with: {
      items: { with: { ticketType: true } },
      attendee: true,
    },
  });
}

export async function getOrderByStripePaymentIntent(paymentIntentId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.stripePaymentIntentId, paymentIntentId),
    with: {
      items: { with: { ticketType: true } },
      attendee: true,
    },
  });
}

export async function updateOrderPaymentStatus(
  orderId: string,
  data: Partial<{
    paymentStatus: "pending" | "paid" | "free" | "refunded" | "partially_refunded";
    stripePaymentIntentId: string;
    stripeCheckoutSessionId: string;
    refundedAmount: number;
  }>
) {
  const [order] = await db
    .update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();
  return order;
}

export async function getEventRevenueByTicketType(eventId: string) {
  const result = await db
    .select({
      ticketTypeId: orderItems.ticketTypeId,
      ticketName: ticketTypes.name,
      totalQuantity: sql<number>`sum(${orderItems.quantity})::int`,
      totalRevenue: sql<number>`sum(${orderItems.subtotal})::int`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(ticketTypes, eq(orderItems.ticketTypeId, ticketTypes.id))
    .where(
      and(eq(orders.eventId, eventId), eq(orders.paymentStatus, "paid"))
    )
    .groupBy(orderItems.ticketTypeId, ticketTypes.name);

  return result;
}

export async function getEventOrderStats(eventId: string) {
  const result = await db
    .select({
      totalOrders: sql<number>`count(*)::int`,
      totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)::int`,
      totalRefunded: sql<number>`coalesce(sum(${orders.refundedAmount}), 0)::int`,
      paidOrders: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'paid')::int`,
    })
    .from(orders)
    .where(eq(orders.eventId, eventId));

  return result[0] ?? { totalOrders: 0, totalRevenue: 0, totalRefunded: 0, paidOrders: 0 };
}

export async function decrementTicketSoldCount(
  ticketTypeId: string,
  quantity: number
) {
  const [ticket] = await db
    .update(ticketTypes)
    .set({
      soldCount: sql`greatest(${ticketTypes.soldCount} - ${quantity}, 0)`,
    })
    .where(eq(ticketTypes.id, ticketTypeId))
    .returning();
  return ticket;
}
