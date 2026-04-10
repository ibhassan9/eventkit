"use client";

import { useState } from "react";
import { Loader2, Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { useSpeakers } from "@/hooks/use-speakers";
import { SpeakersGrid } from "./speakers-grid";
import { SpeakersTable } from "./speakers-table";
import { SpeakerSheet } from "./speaker-sheet";

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
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<SpeakerData | null>(null);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Speakers</h1>
          <p className="text-sm text-muted-foreground">
            Manage speakers for your event
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-stone-50 p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`rounded-md p-1.5 transition-colors ${view === "grid" ? "bg-white shadow-sm text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`rounded-md p-1.5 transition-colors ${view === "table" ? "bg-white shadow-sm text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={handleAddSpeaker} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Speaker
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <SpeakersGrid
          speakers={(speakers ?? []) as SpeakerData[]}
          eventId={eventId}
          onEditSpeaker={handleEditSpeaker}
        />
      ) : (
        <SpeakersTable
          speakers={(speakers ?? []) as SpeakerData[]}
          eventId={eventId}
          onEditSpeaker={handleEditSpeaker}
        />
      )}

      <SpeakerSheet
        open={sheetOpen}
        onOpenChange={(open) => { if (!open) handleSheetClose(); }}
        eventId={eventId}
        speaker={editingSpeaker}
      />
    </div>
  );
}
