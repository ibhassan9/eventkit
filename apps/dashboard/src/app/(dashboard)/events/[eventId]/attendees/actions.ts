"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { adminAddAttendeeSchema } from "@eventkit/lib/validators";
import {
  getEventById,
  getAttendeeByEmail,
  createAttendeeWithUser,
  getAttendeeById,
  updateUserPassword,
  getAttendeesByUserId,
} from "@eventkit/db/queries";
import {
  generateTemporaryPassword,
  hashPassword,
} from "@eventkit/lib/passwords";
import { sendEmail } from "@eventkit/lib/resend";
import { WelcomeAttendeeEmail } from "@eventkit/emails/welcome-attendee";
import { formatDate } from "@eventkit/lib/utils";
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

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);
    const qrCode = crypto.randomUUID();

    const result = await createAttendeeWithUser({
      eventId: input.eventId,
      ticketTypeId: input.ticketTypeId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      company: input.company,
      jobTitle: input.jobTitle,
      customFieldValues: input.customFieldValues,
      paymentStatus: input.paymentStatus ?? "free",
      qrCode,
      passwordHash,
      temporaryPassword,
    });

    if (input.sendWelcomeEmail && result.isNewUser) {
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
          tempPassword: temporaryPassword,
          eventSlug: event.slug,
        }),
      });
    }

    revalidatePath(`/events/${input.eventId}/attendees`);

    return {
      attendee: result.attendee,
      user: result.user,
      isNewUser: result.isNewUser,
      temporaryPassword: result.isNewUser ? temporaryPassword : undefined,
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

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    await updateUserPassword(attendee.userId, {
      passwordHash,
      mustChangePassword: true,
      temporaryPassword,
    });

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
