"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchBadgeTemplates } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import {
  saveBadgeTemplate,
  deleteBadgeTemplateAction,
} from "@/app/(dashboard)/events/[eventId]/badges/actions";

export function useBadgeTemplates(eventId: string) {
  return useQuery({
    queryKey: queryKeys.badgeTemplates.list(eventId),
    queryFn: () => fetchBadgeTemplates({ eventId }).then(unwrapAction),
  });
}

export function useSaveBadgeTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveBadgeTemplate,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.badgeTemplates.all,
        });
      }
    },
  });
}

export function useDeleteBadgeTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBadgeTemplateAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.badgeTemplates.all,
        });
      }
    },
  });
}
