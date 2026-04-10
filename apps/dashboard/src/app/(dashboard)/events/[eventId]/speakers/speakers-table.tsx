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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24">
        <Users2 className="h-10 w-10 text-stone-300" />
        <h3 className="mt-4 text-sm font-medium text-stone-900">No speakers yet</h3>
        <p className="mt-1 text-sm text-stone-500">
          Add speakers to feature them on your event website
        </p>
      </div>
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
                {["", "Name", "Title", "Company", "Sessions", ""].map((h, i) => (
                  <th key={i} className="h-10 px-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => {
                const initials = `${speaker.firstName[0] ?? ""}${speaker.lastName[0] ?? ""}`.toUpperCase();
                return (
                  <tr
                    key={speaker.id}
                    className="border-b hover:bg-stone-50 cursor-pointer transition-colors"
                    onClick={() => onEditSpeaker(speaker)}
                  >
                    <td className="px-3 py-2 w-12">
                      <Avatar size="sm">
                        {speaker.headshotUrl && (
                          <AvatarImage src={speaker.headshotUrl} alt={`${speaker.firstName} ${speaker.lastName}`} />
                        )}
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {speaker.firstName} {speaker.lastName}
                    </td>
                    <td className="px-3 py-2 text-stone-500">{speaker.title ?? ""}</td>
                    <td className="px-3 py-2 text-stone-500">{speaker.company ?? ""}</td>
                    <td className="px-3 py-2 text-stone-500">{speaker.sessionSpeakers.length}</td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
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
