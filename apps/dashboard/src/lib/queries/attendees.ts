"use server";

import { z } from "zod";
import { createSafeQueryWithInput } from "@/lib/safe-action";
import {
  getAttendeesByEventId,
  getCheckinStats,
  getEventById,
} from "@eventkit/db/queries";

const attendeesFilterSchema = z.object({
  eventId: z.string(),
  search: z.string().optional(),
  status: z.string().optional(),
  ticketType: z.string().optional(),
  checkedIn: z.enum(["true", "false", ""]).optional(),
  showCancelled: z.enum(["true", ""]).optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const fetchAttendees = createSafeQueryWithInput(
  attendeesFilterSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }

    const pageSize = input.pageSize ?? 20;
    const page = input.page ?? 1;
    const offset = (page - 1) * pageSize;

    const checkedIn =
      input.checkedIn === "true"
        ? true
        : input.checkedIn === "false"
          ? false
          : undefined;

    const attendees = await getAttendeesByEventId(input.eventId, {
      search: input.search || undefined,
      paymentStatus: input.status || undefined,
      ticketTypeId: input.ticketType || undefined,
      checkedIn,
      showCancelled: input.showCancelled === "true",
      limit: pageSize + 1,
      offset,
    });

    const hasMore = attendees.length > pageSize;
    const displayAttendees = hasMore ? attendees.slice(0, pageSize) : attendees;

    return {
      attendees: displayAttendees,
      hasMore,
      currentPage: page,
    };
  }
);

const checkinDashboardSchema = z.object({
  eventId: z.string(),
});

export const fetchCheckinDashboard = createSafeQueryWithInput(
  checkinDashboardSchema,
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
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
