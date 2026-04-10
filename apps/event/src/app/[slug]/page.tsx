import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDateRange } from "@eventkit/lib/utils";
import { defaultWebsiteConfig } from "@eventkit/lib/default-website-config";
import type { WebsiteConfig, WebsiteSection } from "@eventkit/types";
import { getEvent } from "./lib/get-event";
import { resolveTheme } from "./lib/theme";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { LocationSection } from "./components/location-section";
import { FaqSection } from "./components/faq-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  const dateRange = formatDateRange(event.startDate, event.endDate, event.timezone);

  return {
    title: `${event.name} | EventKit`,
    description: event.description
      ? event.description.slice(0, 160)
      : `Join us for ${event.name} on ${dateRange}`,
    openGraph: {
      title: event.name,
      description: event.description ?? `${event.name} - ${dateRange}`,
      type: "website",
    },
  };
}

export default async function PublicEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const config: WebsiteConfig = event.websiteConfig ?? defaultWebsiteConfig(event.name);
  const resolved = resolveTheme(event);

  // Build a theme object compatible with section components (they expect secondaryColor)
  const theme = {
    ...config.theme,
    secondaryColor: resolved.accentColor,
  };

  const enabledSections = config.sections.filter(
    (s) => s.enabled && s.type !== "schedule" && s.type !== "speakers"
  );

  return (
    <>
      {enabledSections.map((section) => (
        <SectionRenderer
          key={section.type}
          section={section}
          theme={theme}
          event={{
            name: event.name,
            startDate: event.startDate,
            endDate: event.endDate,
            timezone: event.timezone,
          }}
          slug={slug}
        />
      ))}
    </>
  );
}

function SectionRenderer({
  section,
  theme,
  event,
  slug,
}: {
  section: WebsiteSection;
  theme: WebsiteConfig["theme"];
  event: { name: string; startDate: Date; endDate: Date; timezone: string };
  slug: string;
}) {
  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          data={section.data}
          theme={theme}
          event={event}
          slug={slug}
        />
      );
    case "about":
      return <AboutSection data={section.data} theme={theme} />;
    case "location":
      return <LocationSection data={section.data} theme={theme} />;
    case "faq":
      return <FaqSection data={section.data} theme={theme} />;
  }
}
