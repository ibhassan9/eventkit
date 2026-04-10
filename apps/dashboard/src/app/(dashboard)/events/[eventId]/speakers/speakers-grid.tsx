"use client";

import { Users2 } from "lucide-react";
import { SpeakerCard } from "./speaker-card";

type SpeakerData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  headshotUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  sessionSpeakers: {
    session: {
      id: string;
      title: string;
    };
  }[];
};

interface SpeakersGridProps {
  speakers: SpeakerData[];
  eventId: string;
  onEditSpeaker: (speaker: SpeakerData) => void;
}

export function SpeakersGrid({ speakers, eventId, onEditSpeaker }: SpeakersGridProps) {
  if (speakers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24">
        <Users2 className="h-10 w-10 text-stone-300" />
        <h3 className="mt-4 text-sm font-medium text-stone-900">No speakers yet</h3>
        <p className="mt-1 text-sm text-stone-500">
          Add speakers to feature them on your event website
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {speakers.map((speaker) => (
        <SpeakerCard
          key={speaker.id}
          speaker={speaker}
          eventId={eventId}
          onEdit={onEditSpeaker}
        />
      ))}
    </div>
  );
}
