import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSessionsByEventId } from "@eventkit/db/queries";
import { defaultWebsitePages } from "@eventkit/lib/default-website-pages";
import { getEvent } from "../lib/get-event";
import { resolveTheme } from "../lib/theme";
import { groupSessionsByDate } from "../lib/group-sessions";
import { ScheduleContent } from "./schedule-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  const websitePages = event.websitePages ?? defaultWebsitePages();

  return {
    title: `${websitePages.pages.schedule.title} - ${event.name} | EventKit`,
    description: `View the schedule for ${event.name}`,
  };
}

export default async function SchedulePage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const websitePages = event.websitePages ?? defaultWebsitePages();

  if (!websitePages.pages.schedule.visible) {
    notFound();
  }

  const sessions = await getSessionsByEventId(event.id);
  const theme = resolveTheme(event);

  const grouped = groupSessionsByDate(sessions, event.timezone);

  // Convert Map to serializable format for client component
  const groupedSessions = Array.from(grouped.entries()).map(([date, items]) => ({
    date,
    sessions: items.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      location: s.location,
      track: s.track,
      speakers: s.sessionSpeakers.map((ss) => ({
        id: ss.speaker.id,
        name: `${ss.speaker.firstName} ${ss.speaker.lastName}`,
        role: ss.role,
      })),
    })),
  }));

  const tracks = Array.from(
    new Set(sessions.map((s) => s.track).filter(Boolean) as string[])
  );

  const speakersVisible = websitePages.pages.speakers.visible;

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: theme.primaryColor }}
        >
          {websitePages.pages.schedule.title}
        </h1>
        <ScheduleContent
          groupedSessions={groupedSessions}
          tracks={tracks}
          slug={slug}
          timezone={event.timezone}
          primaryColor={theme.primaryColor}
          accentColor={theme.accentColor}
          speakersVisible={speakersVisible}
        />
      </div>
    </div>
  );
}
