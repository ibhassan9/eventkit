import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import {
  getAttendeeByPaymentIntent,
  getAttendeeById,
  updateAttendee,
} from "@/db/queries";
import { generateQRCode } from "@/lib/qr";
import { sendEmail } from "@/lib/resend";
import { ConfirmationEmail } from "@emails/confirmation";
import { getEventById, getTicketTypeById } from "@/db/queries";

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
        });
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const pi = typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : null;
        await handleChargeRefunded({ payment_intent: pi });
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
}) {
  const attendeeId = session.metadata?.attendeeId;
  if (!attendeeId) return;

  const attendee = await getAttendeeById(attendeeId);
  if (!attendee) return;

  await updateAttendee(attendeeId, {
    paymentStatus: "paid",
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : undefined,
  });

  try {
    const eventData = await getEventById(attendee.eventId);
    const ticketType = await getTicketTypeById(attendee.ticketTypeId);
    if (!eventData || !ticketType) return;

    const qrDataUrl = await generateQRCode(attendee.qrCode);
    await sendEmail({
      to: attendee.email,
      subject: `Payment Confirmed: ${eventData.name}`,
      react: ConfirmationEmail({
        attendeeName: `${attendee.firstName} ${attendee.lastName}`,
        eventName: eventData.name,
        eventDate: eventData.startDate.toISOString(),
        venue: eventData.venue ?? "TBA",
        ticketType: ticketType.name,
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
}) {
  if (!charge.payment_intent || typeof charge.payment_intent !== "string") {
    return;
  }

  const attendee = await getAttendeeByPaymentIntent(charge.payment_intent);
  if (!attendee) return;

  await updateAttendee(attendee.id, {
    paymentStatus: "refunded",
  });
}
