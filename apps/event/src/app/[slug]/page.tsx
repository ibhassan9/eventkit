import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@eventkit/db/queries";
import { formatDateRange } from "@eventkit/lib/utils";
import type { WebsiteConfig, WebsiteSection } from "@eventkit/types";
import { defaultWebsiteConfig } from "@eventkit/lib/default-website-config";
import { EventNav } from "./components/event-nav";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { ScheduleSection } from "./components/schedule-section";
import { SpeakersSection } from "./components/speakers-section";
import { LocationSection } from "./components/location-section";
import { FaqSection } from "./components/faq-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
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
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const config: WebsiteConfig = event.websiteConfig ?? defaultWebsiteConfig(event.name);

  const enabledSections = config.sections.filter((s) => s.enabled);
  const { theme } = config;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily === "system" ? "system-ui, sans-serif" : undefined,
      }}
    >
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <EventNav
        eventName={event.name}
        slug={slug}
        primaryColor={theme.primaryColor}
        secondaryColor={theme.secondaryColor}
        sections={enabledSections}
      />
      <main>
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
      </main>
      <footer
        className="border-t py-8 text-center text-sm"
        style={{ color: `${theme.primaryColor}80` }}
      >
        <p>Powered by EventKit</p>
      </footer>
    </div>
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
    case "schedule":
      return <ScheduleSection data={section.data} theme={theme} />;
    case "speakers":
      return <SpeakersSection data={section.data} theme={theme} />;
    case "location":
      return <LocationSection data={section.data} theme={theme} />;
    case "faq":
      return <FaqSection data={section.data} theme={theme} />;
  }
}
