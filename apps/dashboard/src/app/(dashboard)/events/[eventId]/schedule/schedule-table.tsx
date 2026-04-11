"use client";

import { Fragment, useState } from "react";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { useDeleteSession } from "@/hooks/use-sessions";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";

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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const deleteSession = useDeleteSession();

  if (sessions.length === 0) {
    return (
      <DataTableEmptyState
        icon={Calendar}
        title="No sessions yet"
        description="Build your event schedule by adding sessions"
      />
    );
  }

  const grouped = groupSessionsByDate(sessions);

  async function handleDelete(sessionId: string) {
    const result = await deleteSession.mutateAsync({ eventId, sessionId });
    if (result.success) {
      toast.success("Session deleted");
      setDeleteTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-stone-50">
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Time</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Title</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Location</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Speakers</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400" />
              </tr>
            </thead>
            <tbody>
              {grouped.map(([dateKey, dateSessions], dayIndex) => (
                <Fragment key={dateKey}>
                  <tr className="bg-stone-50 sticky top-0 z-10">
                    <td colSpan={5} className="px-3 pt-4 pb-2">
                      <span className="text-[13px] font-medium text-stone-500">
                        Day {dayIndex + 1} &mdash; {format(new Date(dateKey + "T00:00:00"), "EEEE, MMMM d, yyyy")}
                      </span>
                    </td>
                  </tr>
                  {dateSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors text-[13px] text-stone-700"
                      onClick={() => onEditSession(session)}
                    >
                      <td className="px-3 py-3 whitespace-nowrap text-stone-600">
                        {format(new Date(session.startTime), "h:mm a")} &ndash; {format(new Date(session.endTime), "h:mm a")}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-stone-900">{session.title}</div>
                        {session.description && <div className="text-xs text-stone-400 truncate max-w-sm">{session.description}</div>}
                      </td>
                      <td className="px-3 py-3 text-stone-500">{session.location ?? ""}</td>
                      <td className="px-3 py-3 text-stone-500">
                        {session.sessionSpeakers
                          .map((ss) => `${ss.speaker.firstName} ${ss.speaker.lastName}`)
                          .join(", ")}
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}
