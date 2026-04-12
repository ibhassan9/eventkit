"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@eventkit/ui/checkbox";
import { Label } from "@eventkit/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@eventkit/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@eventkit/lib/utils";
import { cancelAttendeeAction } from "./actions";

interface CancelAttendeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendeeId: string;
  attendeeName: string;
  eventId: string;
  paymentStatus: string;
  amountPaid: number;
  currency: string;
  onSuccess: () => void;
}

export function CancelAttendeeDialog({
  open,
  onOpenChange,
  attendeeId,
  attendeeName,
  eventId,
  paymentStatus,
  amountPaid,
  currency,
  onSuccess,
}: CancelAttendeeDialogProps) {
  const [issueRefund, setIssueRefund] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const canRefund = paymentStatus === "paid" && amountPaid > 0;

  async function handleCancel() {
    setCancelling(true);
    const result = await cancelAttendeeAction({
      eventId,
      attendeeId,
      issueRefund: canRefund && issueRefund,
    });
    setCancelling(false);

    if (result.success) {
      toast.success(
        issueRefund && canRefund
          ? "Registration cancelled and refund issued"
          : "Registration cancelled"
      );
      onOpenChange(false);
      setIssueRefund(false);
      onSuccess();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel the registration for{" "}
            <span className="font-medium text-foreground">{attendeeName}</span>?
            This will free up their ticket spot.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {canRefund && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <Checkbox
              id="cancel-refund"
              checked={issueRefund}
              onCheckedChange={(checked) => setIssueRefund(checked === true)}
            />
            <Label htmlFor="cancel-refund" className="text-sm text-amber-800">
              Issue refund of {formatCurrency(amountPaid, currency)} via Stripe
            </Label>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={cancelling}
            onClick={() => setIssueRefund(false)}
          >
            Keep Registration
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={cancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {cancelling && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Cancel Registration
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
