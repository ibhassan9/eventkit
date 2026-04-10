"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function WebsiteEditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24">
      <AlertCircle className="mb-4 size-10 text-destructive" />
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {error.message || "Failed to load the website editor."}
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
