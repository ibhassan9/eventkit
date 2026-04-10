"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAttendees } from "@/hooks/use-attendees";
import { useTicketTypes } from "@/hooks/use-ticket-types";
import { useRegistrationConfig } from "@/hooks/use-registration-config";
import { AttendeesTable } from "./attendees-table";

interface AttendeesClientProps {
  eventId: string;
}

export function AttendeesClient({ eventId }: AttendeesClientProps) {
  const searchParams = useSearchParams();

  const filters = {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    ticketType: searchParams.get("ticketType") ?? "",
    checkedIn: searchParams.get("checkedIn") ?? "",
  };

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const {
    data: attendeesData,
    isLoading: attendeesLoading,
    error: attendeesError,
  } = useAttendees(eventId, {
    search: filters.search || undefined,
    status: filters.status || undefined,
    ticketType: filters.ticketType || undefined,
    checkedIn: filters.checkedIn || undefined,
    page,
  });

  const {
    data: ticketTypes,
    isLoading: ticketTypesLoading,
  } = useTicketTypes(eventId);

  const {
    data: registrationConfig,
    isLoading: registrationConfigLoading,
  } = useRegistrationConfig(eventId);

  const isLoading = attendeesLoading || ticketTypesLoading || registrationConfigLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendees</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (attendeesError) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendees</h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load attendees. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendees</h1>
        <p className="text-sm text-muted-foreground">
          Manage attendees for this event
        </p>
      </div>
      <AttendeesTable
        attendees={attendeesData?.attendees ?? []}
        ticketTypes={ticketTypes ?? []}
        eventId={eventId}
        currentPage={attendeesData?.currentPage ?? page}
        hasMore={attendeesData?.hasMore ?? false}
        filters={filters}
        customFields={registrationConfig?.fields ?? []}
      />
    </div>
  );
}
