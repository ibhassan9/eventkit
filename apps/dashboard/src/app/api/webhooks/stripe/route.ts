import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@eventkit/lib/stripe";
import {
  getAttendeeByPaymentIntent,
  getAttendeeById,
  updateAttendee,
  createOrderWithItems,
  getOrderByStripePaymentIntent,
  updateOrderPaymentStatus,
  decrementTicketSoldCount,
} from "@eventkit/db/queries";
import { generateQRCode } from "@eventkit/lib/qr";
import { sendEmail } from "@eventkit/lib/resend";
import { ConfirmationEmail } from "@eventkit/emails/confirmation";
import { getEventById, getTicketTypeById } from "@eventkit/db/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const paymentIntent = typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;
        await handleCheckoutCompleted({
          id: session.id,
          metadata: session.metadata as Record<string, string> | null,
          payment_intent: paymentIntent,
          currency: typeof session.currency === "string" ? session.currency : "cad",
        });
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const pi = typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : null;
        const amountRefunded = typeof charge.amount_refunded === "number"
          ? charge.amount_refunded
          : 0;
        const amount = typeof charge.amount === "number" ? charge.amount : 0;
        await handleChargeRefunded({
          payment_intent: pi,
          amount_refunded: amountRefunded,
          amount,
        });
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    // Always return 200 to prevent Stripe retries on processing errors
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

async function handleCheckoutCompleted(session: {
  id: string;
  metadata?: Record<string, string> | null;
  payment_intent?: string | null;
  currency?: string;
}) {
  const attendeeId = session.metadata?.attendeeId;
  if (!attendeeId) return;

  const attendee = await getAttendeeById(attendeeId);
  if (!attendee) return;

  // Update legacy attendee columns
  await updateAttendee(attendeeId, {
    paymentStatus: "paid",
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : undefined,
  });

  // Create order from metadata if orderData exists
  const orderDataStr = session.metadata?.orderData;
  if (orderDataStr) {
    try {
      const orderData = JSON.parse(orderDataStr) as Array<{
        ticketTypeId: string;
        quantity: number;
        unitPrice: number;
      }>;

      await createOrderWithItems({
        eventId: attendee.eventId,
        attendeeId: attendee.id,
        paymentStatus: "paid",
        currency: (session.currency ?? "cad").toUpperCase(),
        stripeCheckoutSessionId: session.id,
        items: orderData,
      });
    } catch {
      // Order creation failure should not block webhook
    }
  }

  try {
    const eventData = await getEventById(attendee.eventId);
    if (!eventData) return;

    // Build ticket names from orderData or fall back to legacy ticketType
    let ticketName = "General";
    if (orderDataStr) {
      try {
        const orderData = JSON.parse(orderDataStr) as Array<{
          ticketTypeId: string;
          quantity: number;
          unitPrice: number;
        }>;
        const names: string[] = [];
        for (const item of orderData) {
          const tt = await getTicketTypeById(item.ticketTypeId);
          if (tt) {
            names.push(item.quantity > 1 ? `${item.quantity}× ${tt.name}` : tt.name);
          }
        }
        if (names.length > 0) ticketName = names.join(", ");
      } catch {
        // Fall back to legacy
      }
    }

    if (ticketName === "General" && attendee.ticketTypeId) {
      const ticketType = await getTicketTypeById(attendee.ticketTypeId);
      if (ticketType) ticketName = ticketType.name;
    }

    const qrDataUrl = await generateQRCode(attendee.qrCode);
    await sendEmail({
      to: attendee.email,
      subject: `Payment Confirmed: ${eventData.name}`,
      react: ConfirmationEmail({
        attendeeName: `${attendee.firstName} ${attendee.lastName}`,
        eventName: eventData.name,
        eventDate: eventData.startDate.toISOString(),
        venue: eventData.venue ?? "TBA",
        ticketType: ticketName,
        qrCodeDataUrl: qrDataUrl,
        eventSlug: eventData.slug,
      }),
    });

    await updateAttendee(attendeeId, {
      confirmationEmailSentAt: new Date(),
    });
  } catch {
    // Email failure should not block webhook processing
  }
}

async function handleChargeRefunded(charge: {
  payment_intent?: string | null;
  amount_refunded: number;
  amount: number;
}) {
  if (!charge.payment_intent || typeof charge.payment_intent !== "string") {
    return;
  }

  // Update legacy attendee
  const attendee = await getAttendeeByPaymentIntent(charge.payment_intent);
  if (attendee) {
    await updateAttendee(attendee.id, {
      paymentStatus: "refunded",
    });
  }

  // Update order if it exists
  const order = await getOrderByStripePaymentIntent(charge.payment_intent);
  if (order) {
    const isFullRefund = charge.amount_refunded >= charge.amount;

    await updateOrderPaymentStatus(order.id, {
      paymentStatus: isFullRefund ? "refunded" : "partially_refunded",
      refundedAmount: charge.amount_refunded,
    });

    // Only decrement soldCount on full refund
    if (isFullRefund && order.items) {
      for (const item of order.items) {
        await decrementTicketSoldCount(item.ticketTypeId, item.quantity);
      }
    }
  }
}
