"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchSpeakers } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import {
  saveSpeaker,
  deleteSpeakerAction,
} from "@/app/(dashboard)/events/[eventId]/speakers/actions";

export function useSpeakers(eventId: string) {
  return useQuery({
    queryKey: queryKeys.speakers.list(eventId),
    queryFn: () => fetchSpeakers({ eventId }).then(unwrapAction),
  });
}

export function useSaveSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSpeaker,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.speakers.all,
        });
      }
    },
  });
}

export function useDeleteSpeaker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSpeakerAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.speakers.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all,
        });
      }
    },
  });
}
