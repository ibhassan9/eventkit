"use client";

import { Button } from "@/components/ui/button";

export default function PublicEventError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        We could not load this event page. Please try again.
      </p>
      <Button variant="outline" size="sm" className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
