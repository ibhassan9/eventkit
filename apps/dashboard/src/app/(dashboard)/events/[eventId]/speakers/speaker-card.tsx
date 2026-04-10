"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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

interface SpeakerCardProps {
  speaker: SpeakerData;
  eventId: string;
  onEdit: (speaker: SpeakerData) => void;
}

export function SpeakerCard({ speaker, eventId, onEdit }: SpeakerCardProps) {
  const [showDelete, setShowDelete] = useState(false);
  const deleteSpeaker = useDeleteSpeaker();

  const initials = `${speaker.firstName[0] ?? ""}${speaker.lastName[0] ?? ""}`.toUpperCase();
  const sessionCount = speaker.sessionSpeakers.length;

  async function handleDelete() {
    const result = await deleteSpeaker.mutateAsync({
      eventId,
      speakerId: speaker.id,
    });
    if (result.success) {
      toast.success("Speaker removed");
      setShowDelete(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="relative bg-white border border-stone-200 rounded-xl p-5">
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
              <MoreHorizontal className="h-4 w-4 text-stone-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(speaker)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16" size="lg">
            {speaker.headshotUrl && (
              <AvatarImage src={speaker.headshotUrl} alt={`${speaker.firstName} ${speaker.lastName}`} />
            )}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="mt-3 text-[16px] font-semibold text-stone-900">
            {speaker.firstName} {speaker.lastName}
          </h3>
          {(speaker.title || speaker.company) && (
            <p className="mt-0.5 text-[13px] text-stone-400">
              {[speaker.title, speaker.company].filter(Boolean).join(" at ")}
            </p>
          )}
          {sessionCount > 0 && (
            <p className="mt-2 text-[12px] text-stone-400">
              Speaking in {sessionCount} session{sessionCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove speaker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {speaker.firstName} {speaker.lastName}?
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
