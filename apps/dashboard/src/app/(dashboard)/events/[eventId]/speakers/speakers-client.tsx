"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { useSpeakers } from "@/hooks/use-speakers";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { SpeakersTable } from "./speakers-table";
import { SpeakerDialog } from "./speaker-dialog";

interface SpeakersClientProps {
  eventId: string;
}

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

export function SpeakersClient({ eventId }: SpeakersClientProps) {
  const { data: speakers, isLoading, error } = useSpeakers(eventId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<SpeakerData | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const filteredSpeakers = ((speakers ?? []) as SpeakerData[]).filter((speaker) => {
    if (!debouncedSearch) return true;
    const fullName = `${speaker.firstName} ${speaker.lastName}`.toLowerCase();
    return fullName.includes(debouncedSearch.toLowerCase());
  });

  function handleAddSpeaker() {
    setEditingSpeaker(null);
    setSheetOpen(true);
  }

  function handleEditSpeaker(speaker: SpeakerData) {
    setEditingSpeaker(speaker);
    setSheetOpen(true);
  }

  function handleSheetClose() {
    setSheetOpen(false);
    setEditingSpeaker(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Speakers</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Speakers</h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load speakers. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Speakers</h1>
        <p className="text-sm text-muted-foreground">
          Manage speakers for your event
        </p>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search speakers..."
        searchValue={search}
        onSearchChange={setSearch}
        actions={
          <Button onClick={handleAddSpeaker} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Speaker
          </Button>
        }
      />

      <SpeakersTable
        speakers={filteredSpeakers}
        eventId={eventId}
        onEditSpeaker={handleEditSpeaker}
      />

      <SpeakerDialog
        open={sheetOpen}
        onOpenChange={(open) => { if (!open) handleSheetClose(); }}
        eventId={eventId}
        speaker={editingSpeaker}
      />
    </div>
  );
}
