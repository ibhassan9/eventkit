"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchOrganization } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import { updateOrg } from "@/app/(dashboard)/settings/actions";

export function useOrganization() {
  return useQuery({
    queryKey: queryKeys.organization.current(),
    queryFn: () => fetchOrganization().then(unwrapAction),
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrg,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.organization.all,
        });
      }
    },
  });
}
