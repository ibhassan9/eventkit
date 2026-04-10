"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchSessions } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import {
  saveSession,
  deleteSessionAction,
  bulkDeleteSessionsAction,
} from "@/app/(dashboard)/events/[eventId]/schedule/actions";

export function useSessions(eventId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.list(eventId),
    queryFn: () => fetchSessions({ eventId }).then(unwrapAction),
  });
}

export function useSaveSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSession,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.speakers.all,
        });
      }
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSessionAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.speakers.all,
        });
      }
    },
  });
}

export function useBulkDeleteSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteSessionsAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.speakers.all,
        });
      }
    },
  });
}
