"use server";

import { z } from "zod";
import { createPublicAction } from "@eventkit/lib/safe-action";
import { createSafeAction } from "@/lib/safe-action";
import {
  performCheckInLogic,
  searchForAttendeesLogic,
  lookupQrCodeLogic,
  fetchCheckinStatsLogic,
} from "@eventkit/lib/checkin";
import {
  getEventById,
  getAttendeesByEventId,
  getCheckinStats,
} from "@eventkit/db/queries";

const checkInSchema = z.object({
  attendeeId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export const performCheckIn = createPublicAction(checkInSchema, performCheckInLogic);

const searchSchema = z.object({
  eventId: z.string().uuid(),
  query: z.string().min(2).max(100),
});

export const searchForAttendees = createPublicAction(searchSchema, searchForAttendeesLogic);

const qrLookupSchema = z.object({
  qrCode: z.string().min(1),
  eventId: z.string().uuid(),
});

export const lookupQrCode = createPublicAction(qrLookupSchema, lookupQrCodeLogic);

const statsSchema = z.object({
  eventId: z.string().uuid(),
});

export const fetchCheckinStats = createPublicAction(statsSchema, fetchCheckinStatsLogic);

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
