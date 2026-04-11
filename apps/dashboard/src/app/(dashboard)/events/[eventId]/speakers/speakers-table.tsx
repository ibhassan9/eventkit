"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Users2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@eventkit/ui/avatar";
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
import { useDeleteSpeaker } from "@/hooks/use-speakers";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";

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

interface SpeakersTableProps {
  speakers: SpeakerData[];
  eventId: string;
  onEditSpeaker: (speaker: SpeakerData) => void;
}

export function SpeakersTable({ speakers, eventId, onEditSpeaker }: SpeakersTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<SpeakerData | null>(null);
  const deleteSpeaker = useDeleteSpeaker();

  if (speakers.length === 0) {
    return (
      <DataTableEmptyState
        icon={Users2}
        title="No speakers yet"
        description="Add speakers to feature them on your event website"
      />
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteSpeaker.mutateAsync({
      eventId,
      speakerId: deleteTarget.id,
    });
    if (result.success) {
      toast.success("Speaker removed");
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
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Speaker</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Email</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Sessions</th>
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400" />
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => {
                const initials = `${speaker.firstName[0] ?? ""}${speaker.lastName[0] ?? ""}`.toUpperCase();
                return (
                  <tr
                    key={speaker.id}
                    className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors text-[13px] text-stone-700"
                    onClick={() => onEditSpeaker(speaker)}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {speaker.headshotUrl && (
                            <AvatarImage src={speaker.headshotUrl} alt={`${speaker.firstName} ${speaker.lastName}`} />
                          )}
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-stone-900">{speaker.firstName} {speaker.lastName}</div>
                          {(speaker.title || speaker.company) && (
                            <div className="text-xs text-stone-400">
                              {[speaker.title, speaker.company].filter(Boolean).join(" at ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-stone-500">{speaker.email ?? "\u2014"}</td>
                    <td className="px-3 py-3 text-stone-500">
                      {speaker.sessionSpeakers.length === 0
                        ? <span className="text-stone-400">No sessions</span>
                        : `${speaker.sessionSpeakers.length} session${speaker.sessionSpeakers.length !== 1 ? "s" : ""}`}
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditSpeaker(speaker)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteTarget(speaker)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove speaker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {deleteTarget?.firstName} {deleteTarget?.lastName}?
              They will be unassigned from all sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
