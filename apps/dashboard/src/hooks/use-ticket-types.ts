"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTicketTypes } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import {
  createTicketTypeAction,
  updateTicketTypeAction,
  deleteTicketTypeAction,
} from "@/app/(dashboard)/events/[eventId]/actions";

export function useTicketTypes(eventId: string) {
  return useQuery({
    queryKey: queryKeys.ticketTypes.list(eventId),
    queryFn: () => fetchTicketTypes({ eventId }).then(unwrapAction),
  });
}

export function useCreateTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicketTypeAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.ticketTypes.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}

export function useUpdateTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTicketTypeAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.ticketTypes.all });
      }
    },
  });
}

export function useDeleteTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicketTypeAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.ticketTypes.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      }
    },
  });
}
