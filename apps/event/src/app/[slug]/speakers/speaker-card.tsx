import Image from "next/image";
import Link from "next/link";
import { Globe, ExternalLink } from "lucide-react";

interface SpeakerSession {
  id: string;
  title: string;
}

interface SpeakerData {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  company: string | null;
  bio: string | null;
  headshotUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  sessions: SpeakerSession[];
}

interface SpeakerCardProps {
  speaker: SpeakerData;
  slug: string;
  primaryColor: string;
  accentColor: string;
}

export function SpeakerCard({
  speaker,
  slug,
  primaryColor,
  accentColor,
}: SpeakerCardProps) {
  const fullName = `${speaker.firstName} ${speaker.lastName}`;
  const initials = `${speaker.firstName[0] ?? ""}${speaker.lastName[0] ?? ""}`.toUpperCase();

  const titleLine = [speaker.title, speaker.company].filter(Boolean).join(" at ");

  const hasSocials = speaker.websiteUrl || speaker.linkedinUrl || speaker.twitterUrl;

  return (
    <div
      id={speaker.id}
      className="rounded-2xl border border-stone-100 bg-white p-6 transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="flex flex-col items-center text-center">
        {/* Headshot / Initials */}
        {speaker.headshotUrl ? (
          <Image
            src={speaker.headshotUrl}
            alt={fullName}
            width={120}
            height={120}
            className="size-[120px] rounded-full object-cover"
          />
        ) : (
          <div
            className="flex size-[120px] items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            }}
          >
            {initials}
          </div>
        )}

        {/* Name */}
        <h3
          className="mt-4 text-lg font-semibold"
          style={{ color: primaryColor }}
        >
          {fullName}
        </h3>

        {/* Title + Company */}
        {titleLine && (
          <p className="mt-1 text-sm text-stone-500">{titleLine}</p>
        )}

        {/* Bio */}
        {speaker.bio && (
          <p className="mt-3 line-clamp-3 text-sm text-stone-600">
            {speaker.bio}
          </p>
        )}

        {/* Social links */}
        {hasSocials && (
          <div className="mt-4 flex items-center gap-2">
            {speaker.websiteUrl && (
              <a
                href={speaker.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 text-stone-400 transition-colors hover:text-stone-600"
                aria-label={`${fullName}'s website`}
              >
                <Globe className="size-4" />
              </a>
            )}
            {speaker.linkedinUrl && (
              <a
                href={speaker.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 text-stone-400 transition-colors hover:text-stone-600"
                aria-label={`${fullName}'s LinkedIn`}
              >
                <ExternalLink className="size-4" />
              </a>
            )}
            {speaker.twitterUrl && (
              <a
                href={speaker.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 text-stone-400 transition-colors hover:text-stone-600"
                aria-label={`${fullName}'s Twitter`}
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        )}

        {/* Session pills */}
        {speaker.sessions.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {speaker.sessions.map((session) => (
              <Link
                key={session.id}
                href={`/${slug}/schedule`}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                {session.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
