"use server";

import { createPublicAction } from "@eventkit/lib/safe-action";
import {
  registerFreeSchema,
  createCheckoutSchema,
  registerCartSchema,
} from "@eventkit/lib/validators";
import { joinWaitlistSchema } from "@eventkit/lib/validators";
import {
  getEventById,
  getTicketTypeById,
  getTicketTypesByEventId,
  getAttendeeByEmail,
  getOrganizationById,
  createAttendee,
  updateAttendee,
  createOrderWithItems,
  getWaitlistEntryByEmailAndTicketType,
  getNextWaitlistPosition,
  createWaitlistEntry,
} from "@eventkit/db/queries";
import { generateQRCode } from "@eventkit/lib/qr";
import { sendEmail } from "@eventkit/lib/resend";
import { createCheckoutSession } from "@eventkit/lib/stripe";
import { checkRateLimit } from "@eventkit/lib/rate-limit";
import { generateTemporaryPassword } from "@eventkit/lib/utils";
import { ConfirmationEmail } from "@eventkit/emails/confirmation";
import { WelcomeAttendeeEmail } from "@eventkit/emails/welcome-attendee";
import { WaitlistConfirmationEmail } from "@eventkit/emails";
import { createAdminClient, getAuthUserIdByEmail } from "@eventkit/lib/supabase/admin";
import { createServerSupabaseClient } from "@eventkit/lib/supabase/server";
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

    // Create or find Supabase Auth user and link to attendee
    const adminSupabase = createAdminClient();
    const existingUserId = await getAuthUserIdByEmail(input.email);

    let userId: string;
    let isNewUser = false;
    let tempPassword: string | null = null;

    if (existingUserId) {
      userId = existingUserId;
    } else {
      tempPassword = generateTemporaryPassword();
      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email: input.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: input.firstName,
          last_name: input.lastName,
          must_change_password: true,
          temporary_password: tempPassword,
        },
      });
      if (createError) throw new Error(`Failed to create user: ${createError.message}`);
      userId = newUser.user.id;
      isNewUser = true;

      // Send welcome email with credentials (only for new users)
      try {
        await sendEmail({
          to: input.email,
          subject: `Your login credentials for ${event.name}`,
          react: WelcomeAttendeeEmail({
            attendeeName: `${input.firstName} ${input.lastName}`,
            eventName: event.name,
            eventDate: event.startDate.toISOString(),
            venue: event.venue ?? undefined,
            ticketType: ticket.name,
            email: input.email,
            tempPassword,
            eventSlug: event.slug,
          }),
        });
      } catch {
        // Email failure should not block registration
      }
    }

    // Link attendee to user
    await updateAttendee(attendee.id, { userId });

    // Auto-login new users (we know the temp password)
    if (isNewUser && tempPassword) {
      const serverSupabase = await createServerSupabaseClient();
      await serverSupabase.auth.signInWithPassword({
        email: input.email,
        password: tempPassword,
      });
    }

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

    // Create or find Supabase Auth user and link to attendee
    const adminSupabase = createAdminClient();
    const existingUserId = await getAuthUserIdByEmail(input.email);

    let userId: string;
    let isNewUser = false;
    let tempPassword: string | null = null;

    if (existingUserId) {
      userId = existingUserId;
    } else {
      tempPassword = generateTemporaryPassword();
      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email: input.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: input.firstName,
          last_name: input.lastName,
          must_change_password: true,
          temporary_password: tempPassword,
        },
      });
      if (createError) throw new Error(`Failed to create user: ${createError.message}`);
      userId = newUser.user.id;
      isNewUser = true;

      // Send welcome email with credentials (only for new users)
      try {
        await sendEmail({
          to: input.email,
          subject: `Your login credentials for ${event.name}`,
          react: WelcomeAttendeeEmail({
            attendeeName: `${input.firstName} ${input.lastName}`,
            eventName: event.name,
            eventDate: event.startDate.toISOString(),
            venue: event.venue ?? undefined,
            ticketType: ticket.name,
            email: input.email,
            tempPassword,
            eventSlug: event.slug,
          }),
        });
      } catch {
        // Email failure should not block registration
      }
    }

    // Link attendee to user
    await updateAttendee(attendee.id, { userId });

    // Auto-login new users (we know the temp password)
    if (isNewUser && tempPassword) {
      const serverSupabase = await createServerSupabaseClient();
      await serverSupabase.auth.signInWithPassword({
        email: input.email,
        password: tempPassword,
      });
    }

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

// --- Cart-based registration actions ---

async function createOrLinkUser(input: {
  email: string;
  firstName: string;
  lastName: string;
  eventName: string;
  eventDate: string;
  venue?: string;
  ticketName: string;
  eventSlug: string;
}) {
  const adminSupabase = createAdminClient();
  const existingUserId = await getAuthUserIdByEmail(input.email);

  if (existingUserId) {
    return { userId: existingUserId, isNewUser: false, tempPassword: null };
  }

  const tempPassword = generateTemporaryPassword();
  const { data: newUser, error: createError } =
    await adminSupabase.auth.admin.createUser({
      email: input.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName,
        must_change_password: true,
        temporary_password: tempPassword,
      },
    });
  if (createError)
    throw new Error(`Failed to create user: ${createError.message}`);

  try {
    await sendEmail({
      to: input.email,
      subject: `Your login credentials for ${input.eventName}`,
      react: WelcomeAttendeeEmail({
        attendeeName: `${input.firstName} ${input.lastName}`,
        eventName: input.eventName,
        eventDate: input.eventDate,
        venue: input.venue,
        ticketType: input.ticketName,
        email: input.email,
        tempPassword,
        eventSlug: input.eventSlug,
      }),
    });
  } catch {
    // Email failure should not block registration
  }

  return { userId: newUser.user.id, isNewUser: true, tempPassword };
}

export const registerFreeCart = createPublicAction(
  registerCartSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`reg:${input.email}`, 5, 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Please try again later.");
    }

    const tickets = await getTicketTypesByEventId(input.items[0].ticketTypeId.slice(0, 0) || "");
    // Fetch the event from the first ticket type
    const firstTicket = await getTicketTypeById(input.items[0].ticketTypeId);
    if (!firstTicket) throw new Error("Ticket type not found");

    const event = await getEventById(firstTicket.eventId);
    if (!event) throw new Error("Event not found");
    if (event.id !== input.eventId) throw new Error("Event mismatch");

    const existing = await getAttendeeByEmail(input.email, event.id);
    if (existing) throw new Error("You are already registered for this event");

    // Validate all items are free and check capacity
    const allTickets = await getTicketTypesByEventId(event.id);
    const ticketMap = new Map(allTickets.map((t) => [t.id, t]));

    const orderItems: Array<{
      ticketTypeId: string;
      quantity: number;
      unitPrice: number;
      ticketName: string;
    }> = [];

    for (const item of input.items) {
      const ticket = ticketMap.get(item.ticketTypeId);
      if (!ticket) throw new Error("Ticket type not found");
      if (ticket.price > 0) throw new Error(`${ticket.name} requires payment`);
      if (
        ticket.capacity &&
        ticket.soldCount + item.quantity > ticket.capacity
      ) {
        throw new Error(`${ticket.name} doesn't have enough availability`);
      }
      orderItems.push({
        ticketTypeId: ticket.id,
        quantity: item.quantity,
        unitPrice: 0,
        ticketName: ticket.name,
      });
    }

    const qrCode = crypto.randomUUID();
    const attendee = await createAttendee({
      eventId: event.id,
      ticketTypeId: input.items[0].ticketTypeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      customFieldValues: input.customFieldValues ?? {},
      paymentStatus: "free",
      amountPaid: 0,
      qrCode,
    });

    // Create order + order items (increments soldCount atomically)
    await createOrderWithItems({
      eventId: event.id,
      attendeeId: attendee.id,
      paymentStatus: "free",
      currency: event.currency,
      items: orderItems.map((i) => ({
        ticketTypeId: i.ticketTypeId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    });

    // Create or link user
    const ticketNames = orderItems.map((i) => i.ticketName).join(", ");
    const { userId, isNewUser, tempPassword } = await createOrLinkUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      eventName: event.name,
      eventDate: event.startDate.toISOString(),
      venue: event.venue ?? undefined,
      ticketName: ticketNames,
      eventSlug: event.slug,
    });

    await updateAttendee(attendee.id, { userId });

    if (isNewUser && tempPassword) {
      const serverSupabase = await createServerSupabaseClient();
      await serverSupabase.auth.signInWithPassword({
        email: input.email,
        password: tempPassword,
      });
    }

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
          ticketType: ticketNames,
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

export const createCartCheckout = createPublicAction(
  registerCartSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`checkout:${input.email}`, 5, 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Please try again later.");
    }

    const firstTicket = await getTicketTypeById(input.items[0].ticketTypeId);
    if (!firstTicket) throw new Error("Ticket type not found");

    const event = await getEventById(firstTicket.eventId);
    if (!event) throw new Error("Event not found");
    if (event.id !== input.eventId) throw new Error("Event mismatch");

    const existing = await getAttendeeByEmail(input.email, event.id);
    if (existing) throw new Error("You are already registered for this event");

    const org = await getOrganizationById(event.organizationId);
    if (!org?.stripeAccountId) {
      throw new Error("Payment is not configured for this event");
    }

    const allTickets = await getTicketTypesByEventId(event.id);
    const ticketMap = new Map(allTickets.map((t) => [t.id, t]));

    const lineItems: Array<{
      ticketTypeId: string;
      ticketName: string;
      ticketDescription: string | null;
      quantity: number;
      unitPrice: number;
    }> = [];
    let totalAmount = 0;

    for (const item of input.items) {
      const ticket = ticketMap.get(item.ticketTypeId);
      if (!ticket) throw new Error("Ticket type not found");
      if (
        ticket.capacity &&
        ticket.soldCount + item.quantity > ticket.capacity
      ) {
        throw new Error(`${ticket.name} doesn't have enough availability`);
      }
      lineItems.push({
        ticketTypeId: ticket.id,
        ticketName: ticket.name,
        ticketDescription: ticket.description,
        quantity: item.quantity,
        unitPrice: ticket.price,
      });
      totalAmount += ticket.price * item.quantity;
    }

    const qrCode = crypto.randomUUID();
    const attendee = await createAttendee({
      eventId: event.id,
      ticketTypeId: input.items[0].ticketTypeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      customFieldValues: input.customFieldValues ?? {},
      paymentStatus: "pending",
      amountPaid: totalAmount,
      qrCode,
    });

    // Create or link user
    const ticketNames = lineItems.map((i) => i.ticketName).join(", ");
    const { userId, isNewUser, tempPassword } = await createOrLinkUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      eventName: event.name,
      eventDate: event.startDate.toISOString(),
      venue: event.venue ?? undefined,
      ticketName: ticketNames,
      eventSlug: event.slug,
    });

    await updateAttendee(attendee.id, { userId });

    if (isNewUser && tempPassword) {
      const serverSupabase = await createServerSupabaseClient();
      await serverSupabase.auth.signInWithPassword({
        email: input.email,
        password: tempPassword,
      });
    }

    const orderData = lineItems.map((i) => ({
      ticketTypeId: i.ticketTypeId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await createCheckoutSession({
      lineItems: lineItems.map((item) => ({
        price_data: {
          currency: event.currency.toLowerCase(),
          product_data: {
            name: `${item.ticketName} — ${event.name}`,
            ...(item.ticketDescription
              ? { description: item.ticketDescription }
              : {}),
          },
          unit_amount: item.unitPrice,
        },
        quantity: item.quantity,
      })),
      connectedAccountId: org.stripeAccountId,
      applicationFeeAmount: Math.round(totalAmount * 0.02),
      successUrl: `${baseUrl}/${event.slug}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/${event.slug}/register`,
      metadata: {
        attendeeId: attendee.id,
        eventId: event.id,
        orderData: JSON.stringify(orderData),
      },
    });

    return { checkoutUrl: session.url };
  }
);

// --- Waitlist ---

export const joinWaitlist = createPublicAction(
  joinWaitlistSchema,
  async (input) => {
    const rateCheck = checkRateLimit(`waitlist:${input.email}`, 5, 60_000);
    if (!rateCheck.allowed) {
      throw new Error("Too many attempts. Please try again later.");
    }

    const ticketType = await getTicketTypeById(input.ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");
    if (!ticketType.allowWaitlist) throw new Error("Waitlist not enabled for this ticket");
    if (
      !ticketType.capacity ||
      ticketType.soldCount < ticketType.capacity
    ) {
      throw new Error(
        "Tickets are still available — no need to join the waitlist"
      );
    }

    // Check for duplicate waitlist entry
    const existing = await getWaitlistEntryByEmailAndTicketType(
      input.email.toLowerCase(),
      input.ticketTypeId
    );
    if (existing) {
      throw new Error("You're already on the waitlist for this ticket");
    }

    // Check if already registered
    const existingAttendee = await getAttendeeByEmail(
      input.email,
      ticketType.eventId
    );
    if (existingAttendee && !existingAttendee.cancelledAt) {
      throw new Error("You're already registered for this event");
    }

    // Get next position and create entry
    const position = await getNextWaitlistPosition(input.ticketTypeId);
    const entry = await createWaitlistEntry({
      eventId: input.eventId,
      ticketTypeId: input.ticketTypeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      position,
    });

    // Send confirmation email
    const event = await getEventById(input.eventId);
    if (event) {
      try {
        await sendEmail({
          to: input.email.toLowerCase(),
          subject: `You're on the waitlist for ${event.name}`,
          react: WaitlistConfirmationEmail({
            attendeeName: `${input.firstName} ${input.lastName}`,
            eventName: event.name,
            eventDate: event.startDate.toISOString(),
            venue: event.venue ?? undefined,
            ticketType: ticketType.name,
            position,
            eventSlug: event.slug,
          }),
        });
      } catch {
        // Email failure should not block waitlist join
      }
    }

    return { entryId: entry.id, position };
  }
);
