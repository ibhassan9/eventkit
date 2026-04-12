"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
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
import { Download, Ban, X, Loader2 } from "lucide-react";
import { exportAttendeesToCsv } from "./export-csv";
import { bulkCancelAttendeesAction } from "./actions";
import type { CustomField } from "@eventkit/types";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  paymentStatus: "pending" | "paid" | "free" | "refunded";
  checkedInAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  ticketTypeId: string | null;
}

interface BulkActionBarProps {
  selectedCount: number;
  selectedIds: Set<string>;
  attendees: Attendee[];
  ticketTypeMap: Record<string, string>;
  eventId: string;
  customFields: CustomField[];
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  selectedIds,
  attendees,
  ticketTypeMap,
  eventId,
  customFields,
  onClear,
}: BulkActionBarProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [issueRefunds, setIssueRefunds] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const selectedAttendees = attendees.filter((a) => selectedIds.has(a.id));
  const hasPaidAttendees = selectedAttendees.some(
    (a) => a.paymentStatus === "paid" && !a.cancelledAt
  );
  const cancellableCount = selectedAttendees.filter(
    (a) => !a.cancelledAt
  ).length;

  function handleExportSelected() {
    exportAttendeesToCsv(selectedAttendees, ticketTypeMap, eventId);
    toast.success(`Exported ${selectedCount} attendees`);
  }

  async function handleBulkCancel() {
    setCancelling(true);
    const ids = selectedAttendees
      .filter((a) => !a.cancelledAt)
      .map((a) => a.id);

    const result = await bulkCancelAttendeesAction({
      eventId,
      attendeeIds: ids,
      issueRefunds,
    });

    setCancelling(false);
    setCancelDialogOpen(false);
    setIssueRefunds(false);

    if (result.success && result.data) {
      const { cancelled, errors } = result.data;
      if (errors.length > 0) {
        toast.warning(
          `Cancelled ${cancelled} attendees. ${errors.length} failed.`
        );
      } else {
        toast.success(`Cancelled ${cancelled} attendees`);
      }
      onClear();
    } else {
      toast.error(result.success ? "Unknown error" : result.error);
    }
  }

  return (
    <>
      <div className="sticky bottom-4 z-10 mx-4 flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg">
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportSelected}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Selected
          </Button>
          {cancellableCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelDialogOpen(true)}
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              Cancel Selected
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {cancellableCount} Registrations</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel {cancellableCount} registration
              {cancellableCount !== 1 ? "s" : ""}? This will free up their
              ticket spots.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {hasPaidAttendees && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <Checkbox
                id="bulk-cancel-refund"
                checked={issueRefunds}
                onCheckedChange={(checked) => setIssueRefunds(checked === true)}
              />
              <Label
                htmlFor="bulk-cancel-refund"
                className="text-sm text-amber-800"
              >
                Issue refunds for paid registrations via Stripe
              </Label>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              onClick={() => setIssueRefunds(false)}
            >
              Keep Registrations
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkCancel}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Cancel {cancellableCount} Registration
              {cancellableCount !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
