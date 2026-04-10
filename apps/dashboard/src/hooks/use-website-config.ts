"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchWebsiteConfig } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import { saveWebsiteConfig } from "@/app/(dashboard)/events/[eventId]/website/actions";

export function useWebsiteConfig(eventId: string) {
  return useQuery({
    queryKey: queryKeys.websiteConfig.detail(eventId),
    queryFn: () => fetchWebsiteConfig({ eventId }).then(unwrapAction),
  });
}

export function useSaveWebsiteConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveWebsiteConfig,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.websiteConfig.all,
        });
      }
    },
  });
}
