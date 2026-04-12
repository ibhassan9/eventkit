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
  showCancelled?: string;
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
      showCancelled: filters.showCancelled,
      page: filters.page,
    }),
    queryFn: () =>
      fetchAttendees({
        eventId,
        search: filters.search,
        status: filters.status,
        ticketType: filters.ticketType,
        checkedIn: (filters.checkedIn as "true" | "false" | "") || undefined,
        showCancelled: (filters.showCancelled as "true" | "") || undefined,
        page: filters.page,
        pageSize: filters.pageSize,
      }).then(unwrapAction),
    placeholderData: keepPreviousData,
  });
}
