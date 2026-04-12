import { useEffect, useRef, useCallback } from "react";
import type { BadgeConfigV2 } from "@eventkit/types";

interface UseAutoSaveOptions {
  config: BadgeConfigV2;
  name: string;
  isDirty: boolean;
  onSave: () => Promise<void>;
  debounceMs?: number;
}

export function useAutoSave({
  config,
  name,
  isDirty,
  onSave,
  debounceMs = 30000,
}: UseAutoSaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;

  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const scheduleAutoSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (isDirtyRef.current) {
        saveRef.current();
      }
    }, debounceMs);
  }, [debounceMs]);

  // Schedule auto-save when config or name changes
  useEffect(() => {
    if (isDirty) {
      scheduleAutoSave();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [config, name, isDirty, scheduleAutoSave]);

  // Save on beforeunload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}
