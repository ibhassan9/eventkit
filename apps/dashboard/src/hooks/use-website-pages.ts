"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchWebsitePages } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import { saveWebsitePages } from "@/app/(dashboard)/events/[eventId]/website/actions";

export function useWebsitePages(eventId: string) {
  return useQuery({
    queryKey: queryKeys.websitePages.detail(eventId),
    queryFn: () => fetchWebsitePages({ eventId }).then(unwrapAction),
  });
}

export function useSaveWebsitePages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveWebsitePages,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.websitePages.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.all,
        });
      }
    },
  });
}
