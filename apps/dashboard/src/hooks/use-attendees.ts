"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchAttendees } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";

interface AttendeeFilters {
  search?: string;
  status?: string;
  ticketType?: string;
  checkedIn?: string;
  page?: number;
  pageSize?: number;
}

export function useAttendees(eventId: string, filters: AttendeeFilters = {}) {
  return useQuery({
    queryKey: queryKeys.attendees.list(eventId, {
      search: filters.search,
      status: filters.status,
      ticketType: filters.ticketType,
      checkedIn: filters.checkedIn,
      page: filters.page,
    }),
    queryFn: () =>
      fetchAttendees({
        eventId,
        search: filters.search,
        status: filters.status,
        ticketType: filters.ticketType,
        checkedIn: (filters.checkedIn as "true" | "false" | "") || undefined,
        page: filters.page,
        pageSize: filters.pageSize,
      }).then(unwrapAction),
    placeholderData: keepPreviousData,
  });
}
