import { useCallback } from "react";

interface ChangeEventDetails {
  reason: string;
}

export function useConfirmClose({
  isDirty,
  onOpenChange,
}: {
  isDirty: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const handleOpenChange = useCallback(
    (open: boolean, eventDetails?: ChangeEventDetails) => {
      if (
        !open &&
        isDirty &&
        (eventDetails?.reason === "outside-press" ||
          eventDetails?.reason === "escape-key")
      ) {
        if (!window.confirm("You have unsaved changes. Discard?")) return;
      }
      onOpenChange(open);
    },
    [isDirty, onOpenChange]
  );

  return { handleOpenChange };
}
