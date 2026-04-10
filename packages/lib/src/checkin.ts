import {
  getAttendeeById,
  getAttendeeByQrCode,
  getAttendeesByEventId,
  checkInAttendee,
  getCheckinStats,
} from "@eventkit/db/queries";
import { formatDate } from "./utils";

export async function performCheckInLogic(input: {
  attendeeId: string;
  eventId: string;
}) {
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

export async function searchForAttendeesLogic(input: {
  eventId: string;
  query: string;
}) {
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

export async function lookupQrCodeLogic(input: {
  qrCode: string;
  eventId: string;
}) {
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

export async function fetchCheckinStatsLogic(input: { eventId: string }) {
  return getCheckinStats(input.eventId);
}
