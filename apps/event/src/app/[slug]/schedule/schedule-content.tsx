"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";

interface SessionSpeaker {
  id: string;
  name: string;
  role: string;
}

interface SessionItem {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  track: string | null;
  speakers: SessionSpeaker[];
}

interface DateGroup {
  date: string;
  sessions: SessionItem[];
}

interface ScheduleContentProps {
  groupedSessions: DateGroup[];
  tracks: string[];
  slug: string;
  timezone: string;
  primaryColor: string;
  accentColor: string;
  speakersVisible: boolean;
}

export function ScheduleContent({
  groupedSessions,
  tracks,
  slug,
  timezone,
  primaryColor,
  accentColor,
  speakersVisible,
}: ScheduleContentProps) {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const filteredGroups = groupedSessions
    .map((group) => ({
      ...group,
      sessions: activeTrack
        ? group.sessions.filter((s) => s.track === activeTrack)
        : group.sessions,
    }))
    .filter((group) => group.sessions.length > 0);

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    });
  }

  function formatDateHeader(dateStr: string) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="mt-8">
      {/* Track filter pills */}
      {tracks.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTrack(null)}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: activeTrack === null ? primaryColor : `${primaryColor}10`,
              color: activeTrack === null ? "#ffffff" : primaryColor,
            }}
          >
            All
          </button>
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setActiveTrack(activeTrack === track ? null : track)}
              className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: activeTrack === track ? primaryColor : `${primaryColor}10`,
                color: activeTrack === track ? "#ffffff" : primaryColor,
              }}
            >
              {track}
            </button>
          ))}
        </div>
      )}

      {/* Sessions by date */}
      {filteredGroups.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-stone-500">No sessions scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredGroups.map((group) => (
            <div key={group.date}>
              <h2
                className="mb-6 text-sm font-semibold tracking-widest uppercase"
                style={{ color: accentColor }}
              >
                {formatDateHeader(group.date)}
              </h2>
              <div className="space-y-0">
                {group.sessions.map((session) => {
                  const isExpanded = expandedSession === session.id;
                  return (
                    <div
                      key={session.id}
                      className="relative flex gap-6 border-l-2 py-6 pl-8"
                      style={{ borderColor: `${primaryColor}15` }}
                    >
                      {/* Timeline dot */}
                      <div
                        className="absolute -left-[5px] top-7 size-2 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="flex-1">
                        {/* Time */}
                        <p className="text-sm text-stone-400">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </p>

                        {/* Title */}
                        <h3
                          className="mt-1 text-lg font-semibold"
                          style={{ color: primaryColor }}
                        >
                          {session.title}
                        </h3>

                        {/* Location and speakers */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
                          {session.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {session.location}
                            </span>
                          )}
                          {session.speakers.length > 0 && (
                            <span>
                              {session.speakers.map((speaker, i) => (
                                <span key={speaker.id}>
                                  {i > 0 && ", "}
                                  {speakersVisible ? (
                                    <Link
                                      href={`/${slug}/speakers#${speaker.id}`}
                                      className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-500"
                                    >
                                      {speaker.name}
                                    </Link>
                                  ) : (
                                    speaker.name
                                  )}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>

                        {/* Track badge */}
                        {session.track && (
                          <span
                            className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: `${accentColor}15`,
                              color: accentColor,
                            }}
                          >
                            {session.track}
                          </span>
                        )}

                        {/* Description (expandable) */}
                        {session.description && (
                          <div className="mt-2">
                            <button
                              onClick={() =>
                                setExpandedSession(isExpanded ? null : session.id)
                              }
                              className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600"
                            >
                              <ChevronDown
                                className={`size-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                              {isExpanded ? "Less" : "More"}
                            </button>
                            {isExpanded && (
                              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                {session.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
