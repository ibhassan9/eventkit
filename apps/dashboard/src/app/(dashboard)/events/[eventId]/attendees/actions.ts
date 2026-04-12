"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { adminAddAttendeeSchema } from "@eventkit/lib/validators";
import {
  getEventById,
  getAttendeeByEmail,
  getAttendeeById,
  getAttendeesByUserId,
  createAttendee,
  updateAttendee,
  getOrdersByAttendeeId,
  updateOrderPaymentStatus,
  decrementTicketSoldCount,
  getNextWaitingEntry,
  offerWaitlistSpot,
  getTicketTypeById,
} from "@eventkit/db/queries";
import { createRefund } from "@eventkit/lib/stripe";
import {
  createAdminClient,
  getAuthUserIdByEmail,
} from "@eventkit/lib/supabase/admin";
import { generateTemporaryPassword, formatDate } from "@eventkit/lib/utils";
import { sendEmail } from "@eventkit/lib/resend";
import { WelcomeAttendeeEmail } from "@eventkit/emails/welcome-attendee";
import crypto from "node:crypto";

export const addAttendee = createSafeAction(
  adminAddAttendeeSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const existing = await getAttendeeByEmail(input.email, input.eventId);
    if (existing) {
      throw new Error(
        "An attendee with this email already exists for this event"
      );
    }

    const supabase = createAdminClient();
    let userId: string;
    let isNewUser = false;
    let temporaryPassword: string | undefined;

    const existingAuthUserId = await getAuthUserIdByEmail(input.email);

    if (!existingAuthUserId) {
      isNewUser = true;
      temporaryPassword = generateTemporaryPassword();

      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: input.email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          first_name: input.firstName,
          last_name: input.lastName,
          must_change_password: true,
          temporary_password: temporaryPassword,
        },
      });
      if (error) throw new Error(`Failed to create user: ${error.message}`);
      userId = newUser.user.id;
    } else {
      userId = existingAuthUserId;
    }

    const qrCode = crypto.randomUUID();

    const attendee = await createAttendee({
      eventId: input.eventId,
      ...(input.ticketTypeId && { ticketTypeId: input.ticketTypeId }),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      company: input.company,
      jobTitle: input.jobTitle,
      customFieldValues: input.customFieldValues,
      paymentStatus: input.paymentStatus ?? "free",
      qrCode,
      userId,
    });

    if (input.sendWelcomeEmail && isNewUser) {
      const ticketType = event.ticketTypes.find(
        (tt) => tt.id === input.ticketTypeId
      );

      await sendEmail({
        to: input.email,
        subject: `Welcome to ${event.name}`,
        react: WelcomeAttendeeEmail({
          attendeeName: `${input.firstName} ${input.lastName}`,
          eventName: event.name,
          eventDate: formatDate(event.startDate),
          venue: event.venue ?? undefined,
          ticketType: ticketType?.name ?? "General",
          email: input.email,
          tempPassword: temporaryPassword!,
          eventSlug: event.slug,
        }),
      });
    }

    revalidatePath(`/events/${input.eventId}/attendees`);

    return {
      attendee,
      isNewUser,
      temporaryPassword: isNewUser ? temporaryPassword : undefined,
    };
  }
);

const resetPasswordSchema = z.object({
  eventId: z.string().uuid(),
  attendeeId: z.string().uuid(),
});

export const resetAttendeePassword = createSafeAction(
  resetPasswordSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const attendee = await getAttendeeById(input.attendeeId);
    if (!attendee) {
      throw new Error("Attendee not found");
    }

    if (!attendee.userId) {
      throw new Error("This attendee does not have a user account");
    }

    const supabase = createAdminClient();
    const temporaryPassword = generateTemporaryPassword();

    const { error } = await supabase.auth.admin.updateUserById(
      attendee.userId,
      {
        password: temporaryPassword,
        user_metadata: {
          must_change_password: true,
          temporary_password: temporaryPassword,
        },
      }
    );
    if (error) throw new Error(`Failed to reset password: ${error.message}`);

    return { temporaryPassword };
  }
);

const getAttendeeUserAccountSchema = z.object({
  attendeeId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export const getAttendeeUserAccount = createSafeAction(
  getAttendeeUserAccountSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    const attendee = await getAttendeeById(input.attendeeId);
    if (!attendee?.userId) return null;

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.getUserById(
      attendee.userId
    );
    if (error || !data?.user) return null;

    const meta = data.user.user_metadata;
    return {
      id: data.user.id,
      email: data.user.email,
      createdAt: data.user.created_at,
      lastSignInAt: data.user.last_sign_in_at,
      mustChangePassword: meta?.must_change_password ?? false,
      temporaryPassword: meta?.temporary_password ?? null,
    };
  }
);

const createAttendeeAccountSchema = z.object({
  attendeeId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export const createAttendeeAccount = createSafeAction(
  createAttendeeAccountSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    const attendee = await getAttendeeById(input.attendeeId);
    if (!attendee) throw new Error("Attendee not found");
    if (attendee.userId) throw new Error("Attendee already has a user account");

    const supabase = createAdminClient();
    const temporaryPassword = generateTemporaryPassword();

    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: attendee.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        first_name: attendee.firstName,
        last_name: attendee.lastName,
        must_change_password: true,
        temporary_password: temporaryPassword,
      },
    });
    if (error) throw new Error(`Failed to create user: ${error.message}`);

    await updateAttendee(attendee.id, { userId: newUser.user.id });
    return { temporaryPassword };
  }
);

const getOtherEventsSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const getAttendeeOtherEvents = createSafeAction(
  getOtherEventsSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const attendeeRecords = await getAttendeesByUserId(input.userId);
    return attendeeRecords.filter((a) => a.eventId !== input.eventId);
  }
);

export const cancelAttendeeAction = createSafeAction(
  z.object({
    eventId: z.string().uuid(),
    attendeeId: z.string().uuid(),
    issueRefund: z.boolean().default(false),
  }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    const attendee = await getAttendeeById(input.attendeeId);
    if (!attendee || attendee.eventId !== input.eventId) {
      throw new Error("Attendee not found");
    }
    if (attendee.cancelledAt) {
      throw new Error("Already cancelled");
    }

    // Process refund if requested
    if (input.issueRefund && attendee.paymentStatus === "paid") {
      const orders = await getOrdersByAttendeeId(attendee.id);
      for (const order of orders) {
        if (order.paymentStatus === "paid" && order.stripePaymentIntentId) {
          await createRefund({
            paymentIntentId: order.stripePaymentIntentId,
          });
          await updateOrderPaymentStatus(order.id, {
            paymentStatus: "refunded",
            refundedAmount: order.totalAmount,
          });
        }
      }
    }

    // Soft-delete attendee
    await updateAttendee(input.attendeeId, { cancelledAt: new Date() });

    // Decrement sold counts
    if (attendee.ticketTypeId) {
      await decrementTicketSoldCount(attendee.ticketTypeId, 1);

      // Check waitlist auto-offer
      const ticketType = await getTicketTypeById(attendee.ticketTypeId);
      if (ticketType?.allowWaitlist) {
        const nextEntry = await getNextWaitingEntry(attendee.ticketTypeId);
        if (nextEntry) {
          await offerWaitlistSpot(nextEntry.id, 48);
        }
      }
    }

    revalidatePath(`/events/${input.eventId}/attendees`);
  }
);

export const bulkCancelAttendeesAction = createSafeAction(
  z.object({
    eventId: z.string().uuid(),
    attendeeIds: z.array(z.string().uuid()),
    issueRefunds: z.boolean().default(false),
  }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }

    let cancelled = 0;
    let refunded = 0;
    const errors: string[] = [];

    for (const attendeeId of input.attendeeIds) {
      try {
        const result = await cancelAttendeeAction({
          eventId: input.eventId,
          attendeeId,
          issueRefund: input.issueRefunds,
        });
        if (result.success) {
          cancelled++;
          if (input.issueRefunds) refunded++;
        } else {
          errors.push(`${attendeeId}: ${result.error}`);
        }
      } catch (e) {
        errors.push(
          `${attendeeId}: ${e instanceof Error ? e.message : "Unknown error"}`
        );
      }
    }

    revalidatePath(`/events/${input.eventId}/attendees`);
    return { cancelled, refunded, errors };
  }
);
