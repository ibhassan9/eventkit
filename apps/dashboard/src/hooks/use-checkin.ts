"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchCheckinDashboard } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import { performCheckIn } from "@/app/(dashboard)/events/[eventId]/checkin/actions";

export function useCheckinDashboard(eventId: string) {
  return useQuery({
    queryKey: queryKeys.checkin.dashboard(eventId),
    queryFn: () => fetchCheckinDashboard({ eventId }).then(unwrapAction),
    refetchInterval: 5000,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: performCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
