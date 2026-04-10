"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CheckinError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mt-4 text-xl font-bold">Check-in unavailable</h1>
      <p className="mt-2 text-center text-muted-foreground">
        {error.message || "Failed to load the check-in page."}
      </p>
      <Button onClick={reset} variant="outline" className="mt-6">
        Try again
      </Button>
    </div>
  );
}
