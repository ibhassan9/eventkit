import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSpeakersByEventId } from "@eventkit/db/queries";
import { defaultWebsitePages } from "@eventkit/lib/default-website-pages";
import { getEvent } from "../lib/get-event";
import { resolveTheme } from "../lib/theme";
import { SpeakerCard } from "./speaker-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  const websitePages = event.websitePages ?? defaultWebsitePages();

  return {
    title: `${websitePages.pages.speakers.title} - ${event.name} | EventKit`,
    description: `Meet the speakers at ${event.name}`,
  };
}

export default async function SpeakersPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const websitePages = event.websitePages ?? defaultWebsitePages();

  if (!websitePages.pages.speakers.visible) {
    notFound();
  }

  const speakers = await getSpeakersByEventId(event.id);
  const theme = resolveTheme(event);

  const sortedSpeakers = [...speakers].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: theme.primaryColor }}
        >
          {websitePages.pages.speakers.title}
        </h1>

        {sortedSpeakers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-stone-500">Speakers will be announced soon.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={{
                  id: speaker.id,
                  firstName: speaker.firstName,
                  lastName: speaker.lastName,
                  title: speaker.title,
                  company: speaker.company,
                  bio: speaker.bio,
                  headshotUrl: speaker.headshotUrl,
                  websiteUrl: speaker.websiteUrl,
                  linkedinUrl: speaker.linkedinUrl,
                  twitterUrl: speaker.twitterUrl,
                  sessions: speaker.sessionSpeakers.map((ss) => ({
                    id: ss.session.id,
                    title: ss.session.title,
                  })),
                }}
                slug={slug}
                primaryColor={theme.primaryColor}
                accentColor={theme.accentColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
