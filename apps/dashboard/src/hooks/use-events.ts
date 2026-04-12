"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchEvents, fetchEventWithStats } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import { createNewEvent } from "@/app/(dashboard)/events/new/actions";
import {
  updateEventAction,
  deleteEventAction,
  cancelEventAction,
  completeEventAction,
} from "@/app/(dashboard)/events/[eventId]/actions";

export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events.list(),
    queryFn: () => fetchEvents().then(unwrapAction),
  });
}

export function useEventWithStats(eventId: string) {
  return useQuery({
    queryKey: queryKeys.events.withStats(eventId),
    queryFn: () => fetchEventWithStats({ eventId }).then(unwrapAction),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewEvent,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEventAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEventAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}

export function useCancelEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelEventAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}

export function useCompleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeEventAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}
