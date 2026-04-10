"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Users2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@eventkit/ui/command";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@eventkit/ui/select";

type SpeakerOption = {
  id: string;
  firstName: string;
  lastName: string;
};

type SelectedSpeaker = {
  speakerId: string;
  role: "speaker" | "moderator" | "panelist";
  sortOrder: number;
};

interface SpeakerSelectProps {
  speakers: SpeakerOption[];
  selected: SelectedSpeaker[];
  onChange: (selected: SelectedSpeaker[]) => void;
  eventId: string;
}

export function SpeakerSelect({ speakers, selected, onChange, eventId }: SpeakerSelectProps) {
  const [search, setSearch] = useState("");

  if (speakers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center">
        <Users2 className="mx-auto h-6 w-6 text-stone-300" />
        <p className="mt-2 text-sm text-stone-500">No speakers added yet.</p>
        <Link
          href={`/events/${eventId}/speakers`}
          className="mt-1 inline-block text-sm text-violet-600 hover:text-violet-700"
        >
          Go to Speakers &rarr;
        </Link>
      </div>
    );
  }

  const selectedIds = new Set(selected.map((s) => s.speakerId));
  const speakerMap = Object.fromEntries(speakers.map((s) => [s.id, s]));

  function addSpeaker(speakerId: string) {
    if (selectedIds.has(speakerId)) return;
    onChange([
      ...selected,
      { speakerId, role: "speaker", sortOrder: selected.length },
    ]);
  }

  function removeSpeaker(speakerId: string) {
    onChange(
      selected
        .filter((s) => s.speakerId !== speakerId)
        .map((s, i) => ({ ...s, sortOrder: i }))
    );
  }

  function changeRole(speakerId: string, role: "speaker" | "moderator" | "panelist") {
    onChange(
      selected.map((s) =>
        s.speakerId === speakerId ? { ...s, role } : s
      )
    );
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="space-y-2">
          {selected.map((s) => {
            const speaker = speakerMap[s.speakerId];
            if (!speaker) return null;
            return (
              <div
                key={s.speakerId}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <span className="text-sm font-medium">
                  {speaker.firstName} {speaker.lastName}
                </span>
                <div className="flex items-center gap-2">
                  <Select value={s.role} onValueChange={(val) => changeRole(s.speakerId, val as "speaker" | "moderator" | "panelist")}>
                    <SelectTrigger size="sm" className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="speaker">Speaker</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="panelist">Panelist</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(s.speakerId)}
                    className="rounded p-0.5 hover:bg-stone-100"
                  >
                    <X className="h-3.5 w-3.5 text-stone-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Command className="rounded-lg border" shouldFilter={true}>
        <CommandInput
          placeholder="Search speakers..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No speakers found.</CommandEmpty>
          <CommandGroup>
            {speakers
              .filter((s) => !selectedIds.has(s.id))
              .map((speaker) => (
                <CommandItem
                  key={speaker.id}
                  value={`${speaker.firstName} ${speaker.lastName}`}
                  onSelect={() => addSpeaker(speaker.id)}
                >
                  {speaker.firstName} {speaker.lastName}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
