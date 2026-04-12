"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  ExternalLink,
  Copy,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { useDeleteEvent, useCompleteEvent } from "@/hooks/use-events";
import { CancelEventDialog } from "./cancel-event-dialog";

interface EventOverviewActionsProps {
  eventSlug: string;
  eventId: string;
  eventStatus: string;
  eventEndDate: Date;
  eventName: string;
  attendeeCount: number;
}

export function EventOverviewActions({
  eventSlug,
  eventId,
  eventStatus,
  eventEndDate,
  eventName,
  attendeeCount,
}: EventOverviewActionsProps) {
  const router = useRouter();
  const eventBaseUrl = process.env.NEXT_PUBLIC_EVENT_URL ?? "http://localhost:3002";
  const registrationUrl = `${eventBaseUrl}/${eventSlug}`;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteEvent = useDeleteEvent();
  const completeEvent = useCompleteEvent();

  function handleCopyLink() {
    navigator.clipboard.writeText(registrationUrl);
    toast.success("Registration link copied to clipboard");
  }

  async function handleComplete() {
    const result = await completeEvent.mutateAsync({ eventId });
    if (result.success) {
      toast.success("Event marked as completed");
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    const result = await deleteEvent.mutateAsync({ eventId });
    if (result.success) {
      toast.success("Event deleted");
      setDeleteOpen(false);
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
  }

  const canComplete =
    eventStatus === "published" && new Date(eventEndDate) < new Date();

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Copy Link
        </Button>
        <a
          href={`${eventBaseUrl}/${eventSlug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </Button>
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="h-8 w-8 p-0" />}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canComplete && (
              <DropdownMenuItem
                onClick={handleComplete}
                disabled={completeEvent.isPending}
              >
                <CheckCircle className="mr-2 h-3.5 w-3.5" />
                Mark as Completed
              </DropdownMenuItem>
            )}
            {eventStatus !== "cancelled" && (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setCancelOpen(true)}
              >
                <XCircle className="mr-2 h-3.5 w-3.5" />
                Cancel Event
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CancelEventDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        eventId={eventId}
        eventName={eventName}
        attendeeCount={attendeeCount}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {eventName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The event and all associated data
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteEvent.isPending}
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteEvent.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
