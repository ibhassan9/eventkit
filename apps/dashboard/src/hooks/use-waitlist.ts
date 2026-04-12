"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchWaitlistEntries,
  fetchWaitlistStats,
  fetchWaitlistCounts,
} from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import {
  offerSpotAction,
  cancelWaitlistEntryAction,
} from "@/app/(dashboard)/events/[eventId]/waitlist/actions";

export function useWaitlist(eventId: string) {
  return useQuery({
    queryKey: queryKeys.waitlist.list(eventId),
    queryFn: () => fetchWaitlistEntries({ eventId }).then(unwrapAction),
  });
}

export function useWaitlistStats(eventId: string) {
  return useQuery({
    queryKey: queryKeys.waitlist.stats(eventId),
    queryFn: () => fetchWaitlistStats({ eventId }).then(unwrapAction),
  });
}

export function useWaitlistCounts(eventId: string) {
  return useQuery({
    queryKey: queryKeys.waitlist.counts(eventId),
    queryFn: () => fetchWaitlistCounts({ eventId }).then(unwrapAction),
  });
}

export function useOfferWaitlistSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: offerSpotAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.waitlist.all,
        });
      }
    },
  });
}

export function useCancelWaitlistEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelWaitlistEntryAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.waitlist.all,
        });
      }
    },
  });
}
