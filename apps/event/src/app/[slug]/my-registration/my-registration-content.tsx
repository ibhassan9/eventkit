"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Download,
  Ticket,
  Building2,
  Briefcase,
} from "lucide-react";
import { Button } from "@eventkit/ui/button";
import {
  generateGoogleCalendarUrl,
  generateICSContent,
} from "@eventkit/lib/calendar";

interface MyRegistrationContentProps {
  attendee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string | null;
    jobTitle: string | null;
    qrCode: string;
    paymentStatus: string;
    customFieldValues: Record<string, string>;
    ticketTypeName: string;
  };
  event: {
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
    venue?: string;
    address?: string;
  };
  primaryColor: string;
  secondaryColor: string;
}

const PAYMENT_STATUS_STYLES: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  free: { label: "Free", bg: "bg-emerald-50", text: "text-emerald-700" },
  paid: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" },
  refunded: { label: "Refunded", bg: "bg-zinc-100", text: "text-zinc-600" },
};

export function MyRegistrationContent({
  attendee,
  event,
  primaryColor,
  secondaryColor,
}: MyRegistrationContentProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(attendee.qrCode, {
          width: 200,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        setQrDataUrl(url);
      } catch {
        // QR generation failure is non-critical
      }
    }
    generate();
  }, [attendee.qrCode]);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const location = event.venue
    ? `${event.venue}${event.address ? `, ${event.address}` : ""}`
    : undefined;

  const calendarUrl = generateGoogleCalendarUrl({
    title: event.name,
    startDate,
    endDate,
    location,
  });

  function handleDownloadICS() {
    const icsContent = generateICSContent({
      title: event.name,
      startDate,
      endDate,
      location,
    });
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const statusStyle = PAYMENT_STATUS_STYLES[attendee.paymentStatus] ??
    PAYMENT_STATUS_STYLES.pending;

  const customFieldEntries = Object.entries(attendee.customFieldValues).filter(
    ([, v]) => v
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: primaryColor }}
        >
          My Registration
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{event.name}</p>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="flex justify-center">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <img
              src={qrDataUrl}
              alt="Registration QR Code"
              width={180}
              height={180}
              className="mx-auto"
            />
            <p className="mt-2 text-center text-xs text-zinc-400">
              Show this at check-in
            </p>
          </div>
        </div>
      )}

      {/* Attendee Info Card */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2
          className="mb-4 text-sm font-semibold"
          style={{ color: primaryColor }}
        >
          Attendee Details
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${secondaryColor}15` }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: secondaryColor }}
              >
                {attendee.firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">
                {attendee.firstName} {attendee.lastName}
              </p>
              <p className="text-zinc-500">{attendee.email}</p>
            </div>
          </div>

          {attendee.company && (
            <div className="flex items-center gap-3 text-zinc-600">
              <Building2 className="size-4 flex-shrink-0" style={{ color: secondaryColor }} />
              <span>{attendee.company}</span>
            </div>
          )}

          {attendee.jobTitle && (
            <div className="flex items-center gap-3 text-zinc-600">
              <Briefcase className="size-4 flex-shrink-0" style={{ color: secondaryColor }} />
              <span>{attendee.jobTitle}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-3 text-zinc-600">
              <Ticket className="size-4 flex-shrink-0" style={{ color: secondaryColor }} />
              <span>{attendee.ticketTypeName}</span>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Fields */}
      {customFieldEntries.length > 0 && (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2
            className="mb-4 text-sm font-semibold"
            style={{ color: primaryColor }}
          >
            Additional Information
          </h2>
          <div className="space-y-2 text-sm">
            {customFieldEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-zinc-500 capitalize">
                  {key.replace(/[-_]/g, " ")}
                </span>
                <span className="font-medium text-zinc-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details Card */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2
          className="mb-4 text-sm font-semibold"
          style={{ color: primaryColor }}
        >
          Event Details
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar
              className="mt-0.5 size-4 flex-shrink-0"
              style={{ color: secondaryColor }}
            />
            <div>
              <p className="font-medium text-zinc-900">
                {startDate.toLocaleDateString("en-CA", { dateStyle: "full" })}
              </p>
              <p className="text-zinc-500">
                {startDate.toLocaleTimeString("en-CA", { timeStyle: "short" })}
              </p>
            </div>
          </div>
          {event.venue && (
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 size-4 flex-shrink-0"
                style={{ color: secondaryColor }}
              />
              <div>
                <p className="font-medium text-zinc-900">{event.venue}</p>
                {event.address && (
                  <p className="text-zinc-500">{event.address}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calendar actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(calendarUrl, "_blank", "noopener")}
        >
          <Calendar data-icon="inline-start" className="size-3.5" />
          Add to Google Calendar
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadICS}>
          <Download data-icon="inline-start" className="size-3.5" />
          Download .ics
        </Button>
      </div>
    </div>
  );
}
