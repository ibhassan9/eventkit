"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import {
  getEventById,
  getAllAttendeesByEventId,
  getTicketTypesByEventId,
} from "@eventkit/db/queries";
import type { RegistrationConfig } from "@eventkit/types";

export const exportAllAttendees = createSafeAction(
  z.object({ eventId: z.string().uuid() }),
  async (input, ctx) => {
    const event = await getEventById(input.eventId);
    if (!event || event.organizationId !== ctx.organizationId) {
      throw new Error("Not found");
    }

    const attendees = await getAllAttendeesByEventId(input.eventId);
    const ticketTypes = await getTicketTypesByEventId(input.eventId);
    const ticketMap = Object.fromEntries(
      ticketTypes.map((t) => [t.id, t.name])
    );
    const customFields =
      (event.registrationFields as RegistrationConfig | null)?.fields ?? [];

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Company",
      "Job Title",
      "Ticket",
      "Payment",
      "Checked In",
      "Check-in Time",
      "Registered",
      ...customFields.map((f) => f.label),
    ];

    const rows = attendees.map((a) => [
      a.firstName,
      a.lastName,
      a.email,
      a.company ?? "",
      a.jobTitle ?? "",
      a.ticketTypeId ? (ticketMap[a.ticketTypeId] ?? "") : "",
      a.paymentStatus,
      a.checkedInAt ? "Yes" : "No",
      a.checkedInAt ? new Date(a.checkedInAt).toISOString() : "",
      new Date(a.createdAt).toISOString(),
      ...customFields.map(
        (f) =>
          (a.customFieldValues as Record<string, string>)?.[f.id] ?? ""
      ),
    ]);

    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    return csv;
  }
);
