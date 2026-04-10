"use client";

import { Calendar, MapPin } from "lucide-react";

interface EventDetailsCardProps {
  eventDate: string;
  venue?: string;
  address?: string;
  primaryColor: string;
  secondaryColor: string;
}

export function EventDetailsCard({
  eventDate,
  venue,
  address,
  primaryColor,
  secondaryColor,
}: EventDetailsCardProps) {
  return (
    <div className="mt-8 space-y-3 rounded-xl border bg-white p-5 text-left">
      <h2
        className="text-sm font-semibold"
        style={{ color: primaryColor }}
      >
        Event Details
      </h2>
      <div className="flex items-start gap-3 text-sm">
        <Calendar
          className="mt-0.5 size-4 flex-shrink-0"
          style={{ color: secondaryColor }}
        />
        <div>
          <p className="font-medium text-zinc-900">
            {new Date(eventDate).toLocaleDateString("en-CA", {
              dateStyle: "full",
            })}
          </p>
          <p className="text-zinc-500">
            {new Date(eventDate).toLocaleTimeString("en-CA", {
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
      {venue && (
        <div className="flex items-start gap-3 text-sm">
          <MapPin
            className="mt-0.5 size-4 flex-shrink-0"
            style={{ color: secondaryColor }}
          />
          <div>
            <p className="font-medium text-zinc-900">{venue}</p>
            {address && <p className="text-zinc-500">{address}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
