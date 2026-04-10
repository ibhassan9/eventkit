"use client";

import { Button } from "@/components/ui/button";

export default function RegisterError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Registration Error
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Something went wrong loading the registration form.
      </p>
      <Button variant="outline" size="sm" className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
