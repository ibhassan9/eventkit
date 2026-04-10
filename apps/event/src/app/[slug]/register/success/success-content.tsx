"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { generateGoogleCalendarUrl } from "@eventkit/lib/calendar";
import { QrCodeDisplay } from "./qr-code-display";
import { EventDetailsCard } from "./event-details-card";

interface SuccessContentProps {
  eventName: string;
  eventSlug: string;
  eventDate: string;
  eventEndDate: string;
  venue?: string;
  address?: string;
  qrCode?: string;
  sessionId?: string;
  primaryColor: string;
  secondaryColor: string;
}

export function SuccessContent({
  eventName,
  eventSlug,
  eventDate,
  eventEndDate,
  venue,
  address,
  qrCode,
  sessionId,
  primaryColor,
  secondaryColor,
}: SuccessContentProps) {
  const [confirmed, setConfirmed] = useState(!!qrCode);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (qrCode || !sessionId || confirmed) return;
    if (pollCount >= 30) return;

    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      if (pollCount >= 3) setConfirmed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [qrCode, sessionId, confirmed, pollCount]);

  const calendarUrl = generateGoogleCalendarUrl({
    title: eventName,
    startDate: new Date(eventDate),
    endDate: new Date(eventEndDate),
    location: venue ? `${venue}${address ? `, ${address}` : ""}` : undefined,
  });

  if (!confirmed) {
    return (
      <div className="w-full max-w-md text-center">
        <Loader2 className="mx-auto size-12 animate-spin" style={{ color: secondaryColor }} />
        <h1 className="mt-6 text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
          Confirming your payment...
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Please wait while we verify your payment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-center">
      <div
        className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full animate-[scaleIn_0.4s_ease-out]"
        style={{ backgroundColor: `${secondaryColor}15` }}
      >
        <CheckCircle className="size-8" style={{ color: secondaryColor }} />
      </div>

      <h1 className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
        You&apos;re registered!
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Your registration for {eventName} has been confirmed.
      </p>

      {qrCode && <QrCodeDisplay qrCode={qrCode} />}

      <EventDetailsCard
        eventDate={eventDate}
        venue={venue}
        address={address}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(calendarUrl, "_blank", "noopener")}
        >
          <Calendar data-icon="inline-start" className="size-3.5" />
          Add to Google Calendar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = `/${eventSlug}`)}
        >
          Back to Event
        </Button>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
