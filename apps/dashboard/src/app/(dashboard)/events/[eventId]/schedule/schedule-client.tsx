"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { useSessions } from "@/hooks/use-sessions";
import { useSpeakers } from "@/hooks/use-speakers";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { ScheduleTable } from "./schedule-table";
import { SessionDialog } from "./session-dialog";

interface ScheduleClientProps {
  eventId: string;
}

type SessionData = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  location: string | null;
  track: string | null;
  capacity: number | null;
  sessionSpeakers: {
    speakerId: string;
    role: "speaker" | "moderator" | "panelist";
    sortOrder: number;
    speaker: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
};

export function ScheduleClient({ eventId }: ScheduleClientProps) {
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useSessions(eventId);
  const { data: speakers } = useSpeakers(eventId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionData | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const filteredSessions = ((sessions ?? []) as SessionData[]).filter((session) => {
    if (!debouncedSearch) return true;
    return session.title.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  function handleAddSession() {
    setEditingSession(null);
    setSheetOpen(true);
  }

  function handleEditSession(session: SessionData) {
    setEditingSession(session);
    setSheetOpen(true);
  }

  function handleSheetClose() {
    setSheetOpen(false);
    setEditingSession(null);
  }

  if (sessionsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (sessionsError) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load sessions. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Manage your event schedule and sessions
        </p>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search sessions..."
        searchValue={search}
        onSearchChange={setSearch}
        actions={
          <Button onClick={handleAddSession} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Session
          </Button>
        }
      />

      <ScheduleTable
        sessions={filteredSessions}
        eventId={eventId}
        onEditSession={handleEditSession}
      />
      <SessionDialog
        open={sheetOpen}
        onOpenChange={(open) => { if (!open) handleSheetClose(); }}
        eventId={eventId}
        session={editingSession}
        speakers={speakers ?? []}
      />
    </div>
  );
}
