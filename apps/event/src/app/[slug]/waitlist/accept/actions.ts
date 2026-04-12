"use server";

import { createPublicAction } from "@eventkit/lib/safe-action";
import { acceptWaitlistOfferSchema } from "@eventkit/lib/validators";
import { verifyWaitlistToken } from "@eventkit/lib/waitlist-token";
import {
  getWaitlistEntryById,
  getEventById,
  getTicketTypeById,
  getAttendeeByEmail,
  createAttendee,
  updateAttendee,
  acceptWaitlistOffer as acceptOffer,
} from "@eventkit/db/queries";
import { sendEmail } from "@eventkit/lib/resend";
import { generateQRCode } from "@eventkit/lib/qr";
import { generateTemporaryPassword } from "@eventkit/lib/utils";
import { ConfirmationEmail } from "@eventkit/emails/confirmation";
import { WelcomeAttendeeEmail } from "@eventkit/emails/welcome-attendee";
import {
  createAdminClient,
  getAuthUserIdByEmail,
} from "@eventkit/lib/supabase/admin";
import { createServerSupabaseClient } from "@eventkit/lib/supabase/server";

export const acceptWaitlistOffer = createPublicAction(
  acceptWaitlistOfferSchema,
  async (input) => {
    const entry = await getWaitlistEntryById(input.entryId);
    if (!entry) throw new Error("Waitlist entry not found");

    // Verify token
    const isValid = verifyWaitlistToken(input.token, input.entryId, entry.email);
    if (!isValid) throw new Error("Invalid token");

    // Check status
    if (entry.status !== "offered") {
      throw new Error("This offer is no longer available");
    }

    // Check expiry
    if (
      entry.offerExpiresAt &&
      new Date(entry.offerExpiresAt) < new Date()
    ) {
      throw new Error("This offer has expired");
    }

    const event = await getEventById(entry.eventId);
    if (!event) throw new Error("Event not found");

    const ticketType = entry.ticketType ?? (await getTicketTypeById(entry.ticketTypeId));
    if (!ticketType) throw new Error("Ticket type not found");

    // Check if already registered
    const existingAttendee = await getAttendeeByEmail(entry.email, event.id);
    if (existingAttendee && !existingAttendee.cancelledAt) {
      throw new Error("You are already registered for this event");
    }

    // Create the attendee
    const qrCode = crypto.randomUUID();
    const attendee = await createAttendee({
      eventId: event.id,
      ticketTypeId: entry.ticketTypeId,
      firstName: entry.firstName,
      lastName: entry.lastName,
      email: entry.email,
      customFieldValues: {},
      paymentStatus: "free",
      amountPaid: 0,
      qrCode,
    });

    // Mark waitlist entry as accepted
    await acceptOffer(entry.id, attendee.id);

    // Create or link Supabase Auth user
    const adminSupabase = createAdminClient();
    const existingUserId = await getAuthUserIdByEmail(entry.email);

    let userId: string;
    let isNewUser = false;
    let tempPassword: string | null = null;

    if (existingUserId) {
      userId = existingUserId;
    } else {
      tempPassword = generateTemporaryPassword();
      const { data: newUser, error: createError } =
        await adminSupabase.auth.admin.createUser({
          email: entry.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name: entry.firstName,
            last_name: entry.lastName,
            must_change_password: true,
            temporary_password: tempPassword,
          },
        });
      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }
      userId = newUser.user.id;
      isNewUser = true;

      // Send welcome email with credentials
      try {
        await sendEmail({
          to: entry.email,
          subject: `Your login credentials for ${event.name}`,
          react: WelcomeAttendeeEmail({
            attendeeName: `${entry.firstName} ${entry.lastName}`,
            eventName: event.name,
            eventDate: event.startDate.toISOString(),
            venue: event.venue ?? undefined,
            ticketType: ticketType.name,
            email: entry.email,
            tempPassword,
            eventSlug: event.slug,
          }),
        });
      } catch {
        // Email failure should not block acceptance
      }
    }

    // Link attendee to user
    await updateAttendee(attendee.id, { userId });

    // Auto-login new users
    if (isNewUser && tempPassword) {
      const serverSupabase = await createServerSupabaseClient();
      await serverSupabase.auth.signInWithPassword({
        email: entry.email,
        password: tempPassword,
      });
    }

    // Send confirmation email
    try {
      const qrDataUrl = await generateQRCode(qrCode);
      await sendEmail({
        to: entry.email,
        subject: `Registration Confirmed: ${event.name}`,
        react: ConfirmationEmail({
          attendeeName: `${entry.firstName} ${entry.lastName}`,
          eventName: event.name,
          eventDate: event.startDate.toISOString(),
          venue: event.venue ?? "TBA",
          ticketType: ticketType.name,
          qrCodeDataUrl: qrDataUrl,
          eventSlug: event.slug,
        }),
      });
    } catch {
      // Email send failure should not block acceptance
    }

    return { attendeeId: attendee.id, qrCode };
  }
);
