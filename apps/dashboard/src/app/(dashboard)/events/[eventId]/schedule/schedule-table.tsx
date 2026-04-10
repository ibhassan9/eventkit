"use client";

import { Fragment, useState } from "react";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Checkbox } from "@eventkit/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@eventkit/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@eventkit/ui/alert-dialog";
import { useDeleteSession, useBulkDeleteSessions } from "@/hooks/use-sessions";

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

interface ScheduleTableProps {
  sessions: SessionData[];
  eventId: string;
  onEditSession: (session: SessionData) => void;
}

function groupSessionsByDate(sessions: SessionData[]) {
  const groups: Record<string, SessionData[]> = {};
  for (const session of sessions) {
    const dateKey = format(new Date(session.startTime), "yyyy-MM-dd");
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(session);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export function ScheduleTable({ sessions, eventId, onEditSession }: ScheduleTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const deleteSession = useDeleteSession();
  const bulkDeleteSessions = useBulkDeleteSessions();

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24">
        <Calendar className="h-10 w-10 text-stone-300" />
        <h3 className="mt-4 text-sm font-medium text-stone-900">No sessions yet</h3>
        <p className="mt-1 text-sm text-stone-500">
          Build your event schedule by adding sessions
        </p>
      </div>
    );
  }

  const grouped = groupSessionsByDate(sessions);
  const allIds = sessions.map((s) => s.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDelete(sessionId: string) {
    const result = await deleteSession.mutateAsync({ eventId, sessionId });
    if (result.success) {
      toast.success("Session deleted");
      setDeleteTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  async function handleBulkDelete() {
    const result = await bulkDeleteSessions.mutateAsync({
      eventId,
      sessionIds: Array.from(selectedIds),
    });
    if (result.success) {
      toast.success(`${selectedIds.size} session${selectedIds.size > 1 ? "s" : ""} deleted`);
      setSelectedIds(new Set());
      setShowBulkDelete(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-stone-50 border px-4 py-2">
          <span className="text-sm text-stone-600">
            {selectedIds.size} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowBulkDelete(true)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      )}

      <div className="rounded-xl border bg-card">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-stone-50">
                <th className="h-10 w-10 px-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="h-10 px-3 text-left font-medium">Time</th>
                <th className="h-10 px-3 text-left font-medium">Title</th>
                <th className="h-10 px-3 text-left font-medium">Location</th>
                <th className="h-10 px-3 text-left font-medium">Track</th>
                <th className="h-10 px-3 text-left font-medium">Speakers</th>
                <th className="h-10 px-3" />
              </tr>
            </thead>
            <tbody>
              {grouped.map(([dateKey, dateSessions], dayIndex) => (
                <Fragment key={dateKey}>
                  <tr>
                    <td colSpan={7} className="px-3 pt-4 pb-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                        Day {dayIndex + 1} &mdash; {format(new Date(dateKey + "T00:00:00"), "EEEE, MMMM d, yyyy")}
                      </span>
                    </td>
                  </tr>
                  {dateSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b hover:bg-stone-50 cursor-pointer transition-colors"
                      onClick={() => onEditSession(session)}
                    >
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(session.id)}
                          onCheckedChange={() => toggleOne(session.id)}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-stone-600">
                        {format(new Date(session.startTime), "h:mm a")} &ndash; {format(new Date(session.endTime), "h:mm a")}
                      </td>
                      <td className="px-3 py-2 font-medium">{session.title}</td>
                      <td className="px-3 py-2 text-stone-500">{session.location ?? ""}</td>
                      <td className="px-3 py-2 text-stone-500">{session.track ?? ""}</td>
                      <td className="px-3 py-2 text-stone-500">
                        {session.sessionSpeakers
                          .map((ss) => `${ss.speaker.firstName} ${ss.speaker.lastName}`)
                          .join(", ")}
                      </td>
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditSession(session)}>
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteTarget(session.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} session{selectedIds.size > 1 ? "s" : ""}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected sessions? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBulkDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
