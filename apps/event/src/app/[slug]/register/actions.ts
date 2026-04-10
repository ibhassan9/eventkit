"use server";

import { createPublicAction } from "@eventkit/lib/safe-action";
import { registerFreeSchema, createCheckoutSchema } from "@eventkit/lib/validators";
import {
  getEventById,
  getTicketTypeById,
  getAttendeeByEmail,
  getOrganizationById,
  createAttendee,
} from "@eventkit/db/queries";
import { generateQRCode } from "@eventkit/lib/qr";
import { sendEmail } from "@eventkit/lib/resend";
import { createCheckoutSession } from "@eventkit/lib/stripe";
import { checkRateLimit } from "@eventkit/lib/rate-limit";
import { ConfirmationEmail } from "@eventkit/emails/confirmation";
import { checkCapacity } from "./check-capacity";

export const registerFree = createPublicAction(
  registerFreeSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`reg:${input.email}`, 5, 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Please try again later.");
    }

    const ticket = await getTicketTypeById(input.ticketTypeId);
    if (!ticket) throw new Error("Ticket type not found");
    if (ticket.price > 0) throw new Error("This ticket requires payment");

    const event = await getEventById(ticket.eventId);
    if (!event) throw new Error("Event not found");

    const existing = await getAttendeeByEmail(input.email, event.id);
    if (existing) throw new Error("You are already registered for this event");

    await checkCapacity(event.id, ticket.id, event.maxAttendees, ticket.capacity);

    const qrCode = crypto.randomUUID();
    const attendee = await createAttendee({
      eventId: event.id,
      ticketTypeId: input.ticketTypeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      customFieldValues: input.customFieldValues ?? {},
      paymentStatus: "free",
      amountPaid: 0,
      qrCode,
    });

    try {
      const qrDataUrl = await generateQRCode(qrCode);
      await sendEmail({
        to: input.email,
        subject: `Registration Confirmed: ${event.name}`,
        react: ConfirmationEmail({
          attendeeName: `${input.firstName} ${input.lastName}`,
          eventName: event.name,
          eventDate: event.startDate.toISOString(),
          venue: event.venue ?? "TBA",
          ticketType: ticket.name,
          qrCodeDataUrl: qrDataUrl,
          eventSlug: event.slug,
        }),
      });
    } catch {
      // Email send failure should not block registration
    }

    return { attendeeId: attendee.id, qrCode };
  }
);

export const createCheckout = createPublicAction(
  createCheckoutSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`checkout:${input.email}`, 5, 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Please try again later.");
    }

    const ticket = await getTicketTypeById(input.ticketTypeId);
    if (!ticket) throw new Error("Ticket type not found");
    if (ticket.price === 0) throw new Error("This ticket is free");

    const event = await getEventById(ticket.eventId);
    if (!event) throw new Error("Event not found");

    const existing = await getAttendeeByEmail(input.email, event.id);
    if (existing) throw new Error("You are already registered for this event");

    await checkCapacity(event.id, ticket.id, event.maxAttendees, ticket.capacity);

    const org = await getOrganizationById(event.organizationId);
    if (!org?.stripeAccountId) {
      throw new Error("Payment is not configured for this event");
    }

    const qrCode = crypto.randomUUID();
    const attendee = await createAttendee({
      eventId: event.id,
      ticketTypeId: input.ticketTypeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      customFieldValues: input.customFieldValues ?? {},
      paymentStatus: "pending",
      amountPaid: ticket.price,
      qrCode,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await createCheckoutSession({
      lineItems: [
        {
          price_data: {
            currency: event.currency.toLowerCase(),
            product_data: { name: `${event.name} - ${ticket.name}` },
            unit_amount: ticket.price,
          },
          quantity: 1,
        },
      ],
      connectedAccountId: org.stripeAccountId,
      applicationFeeAmount: Math.round(ticket.price * 0.02),
      successUrl: `${baseUrl}/${event.slug}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/${event.slug}/register`,
      metadata: { attendeeId: attendee.id, eventId: event.id, ticketTypeId: ticket.id },
    });

    return { checkoutUrl: session.url };
  }
);
