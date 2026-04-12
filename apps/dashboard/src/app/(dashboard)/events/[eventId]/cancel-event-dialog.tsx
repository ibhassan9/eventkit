"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@eventkit/ui/checkbox";
import { Label } from "@eventkit/ui/label";
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
import { cancelEventAction } from "./actions";

interface CancelEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  attendeeCount: number;
}

export function CancelEventDialog({
  open,
  onOpenChange,
  eventId,
  eventName,
  attendeeCount,
}: CancelEventDialogProps) {
  const [refundAll, setRefundAll] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    const result = await cancelEventAction({ eventId, refundAll });
    setCancelling(false);
    if (result.success) {
      toast.success("Event cancelled");
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel {eventName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will notify all {attendeeCount} registered attendee
            {attendeeCount !== 1 ? "s" : ""} and disable registration. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2 px-0">
          <Checkbox
            id="refund-all"
            checked={refundAll}
            onCheckedChange={(checked) => setRefundAll(checked === true)}
          />
          <Label htmlFor="refund-all" className="text-sm font-normal">
            Refund all paid attendees
          </Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Event</AlertDialogCancel>
          <AlertDialogAction
            disabled={cancelling}
            onClick={handleCancel}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {cancelling ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Event"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
