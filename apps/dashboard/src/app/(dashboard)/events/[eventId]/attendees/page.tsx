import { notFound } from "next/navigation";
import {
  getEventById,
  getAttendeesByEventId,
  getTicketTypesByEventId,
} from "@eventkit/db/queries";
import { AttendeesTable } from "./attendees-table";

interface AttendeesPageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{
    search?: string;
    status?: string;
    ticketType?: string;
    checkedIn?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

export default async function AttendeesPage({
  params,
  searchParams,
}: AttendeesPageProps) {
  const { eventId } = await params;
  const search = await searchParams;

  const event = await getEventById(eventId);
  if (!event) notFound();

  const page = Math.max(1, parseInt(search.page ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const checkedIn =
    search.checkedIn === "true"
      ? true
      : search.checkedIn === "false"
        ? false
        : undefined;

  const attendees = await getAttendeesByEventId(eventId, {
    search: search.search,
    paymentStatus: search.status,
    ticketTypeId: search.ticketType,
    checkedIn,
    limit: PAGE_SIZE + 1,
    offset,
  });

  const hasMore = attendees.length > PAGE_SIZE;
  const displayAttendees = hasMore ? attendees.slice(0, PAGE_SIZE) : attendees;

  const ticketTypes = await getTicketTypesByEventId(eventId);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendees</h1>
        <p className="text-sm text-muted-foreground">
          Manage attendees for {event.name}
        </p>
      </div>
      <AttendeesTable
        attendees={displayAttendees}
        ticketTypes={ticketTypes}
        eventId={eventId}
        currentPage={page}
        hasMore={hasMore}
        filters={{
          search: search.search ?? "",
          status: search.status ?? "",
          ticketType: search.ticketType ?? "",
          checkedIn: search.checkedIn ?? "",
        }}
      />
    </div>
  );
}
