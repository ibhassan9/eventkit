"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchRegistrationConfig } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import { saveRegistrationConfig } from "@/app/(dashboard)/events/[eventId]/registration/actions";

export function useRegistrationConfig(eventId: string) {
  return useQuery({
    queryKey: queryKeys.registrationConfig.detail(eventId),
    queryFn: () => fetchRegistrationConfig({ eventId }).then(unwrapAction),
  });
}

export function useSaveRegistrationConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRegistrationConfig,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.registrationConfig.all,
        });
      }
    },
  });
}
