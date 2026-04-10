"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchEmailTemplates } from "@/lib/queries";
import { unwrapAction } from "@/lib/unwrap-action";
import {
  saveEmailTemplate,
  deleteEmailTemplateAction,
  sendEmailToAttendees,
} from "@/app/(dashboard)/events/[eventId]/emails/actions";

export function useEmailTemplates(eventId: string) {
  return useQuery({
    queryKey: queryKeys.emailTemplates.list(eventId),
    queryFn: () => fetchEmailTemplates({ eventId }).then(unwrapAction),
  });
}

export function useSaveEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveEmailTemplate,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.emailTemplates.all,
        });
      }
    },
  });
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmailTemplateAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.emailTemplates.all,
        });
      }
    },
  });
}

export function useSendEmail() {
  return useMutation({
    mutationFn: sendEmailToAttendees,
  });
}
