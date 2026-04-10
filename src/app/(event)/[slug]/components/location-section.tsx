import { MapPin } from "lucide-react";
import type { LocationData, WebsiteConfig } from "@/types";

interface LocationSectionProps {
  data: LocationData;
  theme: WebsiteConfig["theme"];
}

export function LocationSection({ data, theme }: LocationSectionProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${data.venue} ${data.address}`
  )}`;

  return (
    <section
      id="location"
      className="px-6 py-24"
      style={{ backgroundColor: `${theme.primaryColor}05` }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="mb-2 text-sm font-semibold tracking-widest uppercase"
          style={{ color: theme.secondaryColor }}
        >
          Location
        </h2>
        <h3
          className="text-3xl font-bold tracking-tight"
          style={{ color: theme.primaryColor }}
        >
          {data.venue}
        </h3>
        <div className="mt-4 flex items-center justify-center gap-2">
          <MapPin
            className="size-4"
            style={{ color: `${theme.primaryColor}80` }}
          />
          <p
            className="text-lg"
            style={{ color: `${theme.primaryColor}99` }}
          >
            {data.address}
          </p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <MapPin className="size-4" />
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
