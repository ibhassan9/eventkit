import {
  getEventAttendeeCount,
  getAttendeesByEventId,
} from "@eventkit/db/queries";

export async function checkCapacity(
  eventId: string,
  ticketId: string,
  maxAttendees: number | null,
  ticketCapacity: number | null
) {
  if (maxAttendees) {
    const count = await getEventAttendeeCount(eventId);
    if (count >= maxAttendees) {
      throw new Error("This event has reached maximum capacity");
    }
  }

  if (ticketCapacity) {
    const ticketAttendees = await getAttendeesByEventId(eventId, {
      ticketTypeId: ticketId,
    });
    if (ticketAttendees.length >= ticketCapacity) {
      throw new Error("This ticket type is sold out");
    }
  }
}
