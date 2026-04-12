"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptWaitlistOffer } from "./actions";

interface AcceptFormProps {
  entryId: string;
  token: string;
  eventSlug: string;
  secondaryColor: string;
}

export function AcceptForm({
  entryId,
  token,
  eventSlug,
  secondaryColor,
}: AcceptFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAccept() {
    setError(null);
    startTransition(async () => {
      const result = await acceptWaitlistOffer({ entryId, token });
      if (result.success) {
        router.push(
          `/${eventSlug}/register/success?qr=${result.data.qrCode}`
        );
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mt-6 space-y-3">
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
      <button
        type="button"
        onClick={handleAccept}
        disabled={isPending}
        className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: secondaryColor }}
      >
        {isPending ? "Claiming your spot..." : "Claim My Spot"}
      </button>
      <p className="text-xs text-center text-zinc-400">
        By claiming your spot, you will be registered for the event.
      </p>
    </div>
  );
}
