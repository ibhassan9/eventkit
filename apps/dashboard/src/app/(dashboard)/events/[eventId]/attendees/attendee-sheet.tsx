"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@eventkit/ui/badge";
import { Button } from "@eventkit/ui/button";
import { Separator } from "@eventkit/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@eventkit/ui/sheet";
import { Copy, KeyRound, Loader2 } from "lucide-react";
import { formatDate } from "@eventkit/lib/utils";
import { resetAttendeePassword, getAttendeeOtherEvents } from "./actions";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  paymentStatus: "pending" | "paid" | "free" | "refunded";
  checkedInAt: Date | null;
  createdAt: Date;
  userId?: string | null;
}

interface OtherEvent {
  eventId: string;
  event: {
    id: string;
    name: string;
    startDate: Date;
  };
  ticketType: {
    name: string;
  };
}

interface AttendeeSheetProps {
  attendee: Attendee;
  ticketTypeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  free: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
};

export function AttendeeSheet({
  attendee,
  ticketTypeName,
  open,
  onOpenChange,
  eventId,
}: AttendeeSheetProps) {
  const [resettingPassword, setResettingPassword] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState<string | null>(null);
  const [otherEvents, setOtherEvents] = useState<OtherEvent[]>([]);
  const [loadingOtherEvents, setLoadingOtherEvents] = useState(false);

  useEffect(() => {
    if (open && attendee.userId) {
      setLoadingOtherEvents(true);
      getAttendeeOtherEvents({ eventId, userId: attendee.userId })
        .then((result) => {
          if (result.success) {
            setOtherEvents(result.data as OtherEvent[]);
          }
        })
        .finally(() => setLoadingOtherEvents(false));
    }
    if (!open) {
      setNewTempPassword(null);
      setOtherEvents([]);
    }
  }, [open, attendee.userId, eventId]);

  async function handleResetPassword() {
    setResettingPassword(true);
    const result = await resetAttendeePassword({
      eventId,
      attendeeId: attendee.id,
    });
    setResettingPassword(false);

    if (result.success) {
      setNewTempPassword(result.data.temporaryPassword);
      toast.success("Password reset successfully");
    } else {
      toast.error(result.error);
    }
  }

  async function handleCopyPassword() {
    if (!newTempPassword) return;
    await navigator.clipboard.writeText(newTempPassword);
    toast.success("Password copied to clipboard");
  }

  const fields = [
    { label: "Email", value: attendee.email },
    { label: "Company", value: attendee.company ?? "-" },
    { label: "Job Title", value: attendee.jobTitle ?? "-" },
    { label: "Ticket Type", value: ticketTypeName },
    {
      label: "Payment Status",
      value: (
        <Badge
          variant="secondary"
          className={paymentStyles[attendee.paymentStatus]}
        >
          {attendee.paymentStatus}
        </Badge>
      ),
    },
    {
      label: "Checked In",
      value: attendee.checkedInAt
        ? formatDate(attendee.checkedInAt)
        : "Not checked in",
    },
    { label: "Registered", value: formatDate(attendee.createdAt) },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {attendee.firstName} {attendee.lastName}
          </SheetTitle>
          <SheetDescription>Attendee details</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="space-y-4 p-4">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {field.label}
              </p>
              <div className="mt-1 text-sm">{field.value}</div>
            </div>
          ))}
        </div>

        {attendee.userId && (
          <>
            <Separator />
            <div className="space-y-4 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User Account
              </p>
              <div>
                <p className="text-xs text-muted-foreground">Account Email</p>
                <p className="mt-0.5 text-sm">{attendee.email}</p>
              </div>

              {newTempPassword ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800">
                    New Temporary Password
                  </p>
                  <p className="mt-1 font-mono text-sm">{newTempPassword}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleCopyPassword}
                  >
                    <Copy className="mr-1.5 h-3 w-3" />
                    Copy
                  </Button>
                  <p className="mt-1.5 text-xs text-amber-700">
                    Save this password — it cannot be retrieved later.
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                >
                  {resettingPassword ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Reset Password
                </Button>
              )}
            </div>

            <Separator />
            <div className="space-y-3 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Other Events
              </p>
              {loadingOtherEvents ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading...
                </div>
              ) : otherEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No other events found for this user.
                </p>
              ) : (
                <div className="space-y-2">
                  {otherEvents.map((record) => (
                    <div
                      key={record.eventId}
                      className="rounded-lg border p-3"
                    >
                      <p className="text-sm font-medium">
                        {record.event.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(record.event.startDate)} &middot;{" "}
                        {record.ticketType.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
