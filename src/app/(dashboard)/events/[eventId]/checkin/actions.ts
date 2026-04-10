"use server";

import { z } from "zod";
import { createSafeAction, createPublicAction } from "@/lib/safe-action";
import {
  getAttendeeById,
  getAttendeeByQrCode,
  getAttendeesByEventId,
  checkInAttendee,
  getCheckinStats,
  getEventById,
} from "@/db/queries";
import { formatDate } from "@/lib/utils";

const checkInSchema = z.object({
  attendeeId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export const performCheckIn = createPublicAction(
  checkInSchema,
  async (input) => {
    const attendee = await getAttendeeById(input.attendeeId);
    if (!attendee) throw new Error("Attendee not found");
    if (attendee.eventId !== input.eventId) {
      throw new Error("Attendee does not belong to this event");
    }

    if (attendee.checkedInAt) {
      throw new Error(
        `Already checked in at ${formatDate(attendee.checkedInAt)}`
      );
    }

    await checkInAttendee(input.attendeeId, "checkin-app");
  }
);

const searchSchema = z.object({
  eventId: z.string().uuid(),
  query: z.string().min(2).max(100),
});

export const searchForAttendees = createPublicAction(
  searchSchema,
  async (input) => {
    const attendees = await getAttendeesByEventId(input.eventId, {
      search: input.query,
      limit: 20,
    });

    return attendees.map((a) => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      company: a.company,
      ticketType: null as { name: string } | null,
      checkedInAt: a.checkedInAt?.toISOString() ?? null,
    }));
  }
);

const qrLookupSchema = z.object({
  qrCode: z.string().min(1),
  eventId: z.string().uuid(),
});

export const lookupQrCode = createPublicAction(
  qrLookupSchema,
  async (input) => {
    const attendee = await getAttendeeByQrCode(input.qrCode);
    if (!attendee) throw new Error("QR code not recognized");
    if (attendee.eventId !== input.eventId) {
      throw new Error("This attendee is registered for a different event");
    }

    return {
      id: attendee.id,
      firstName: attendee.firstName,
      lastName: attendee.lastName,
      email: attendee.email,
      company: attendee.company,
      ticketType: attendee.ticketType
        ? { name: attendee.ticketType.name }
        : null,
      checkedInAt: attendee.checkedInAt?.toISOString() ?? null,
    };
  }
);

const statsSchema = z.object({
  eventId: z.string().uuid(),
});

export const fetchCheckinStats = createPublicAction(
  statsSchema,
  async (input) => {
    return getCheckinStats(input.eventId);
  }
);

const dashboardStatsSchema = z.object({
  eventId: z.string().uuid(),
});

export const fetchDashboardCheckinStats = createSafeAction(
  dashboardStatsSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Event not found");
    }
    const stats = await getCheckinStats(input.eventId);
    const recentAttendees = await getAttendeesByEventId(input.eventId, {
      checkedIn: true,
      limit: 10,
    });

    return {
      ...stats,
      recentCheckins: recentAttendees.map((a) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        checkedInAt: a.checkedInAt?.toISOString() ?? null,
      })),
    };
  }
);
