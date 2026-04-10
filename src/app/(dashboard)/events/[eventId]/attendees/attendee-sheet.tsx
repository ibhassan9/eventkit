"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { formatDate } from "@/lib/utils";

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
}

interface AttendeeSheetProps {
  attendee: Attendee;
  ticketTypeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}: AttendeeSheetProps) {
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
      <SheetContent>
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
      </SheetContent>
    </Sheet>
  );
}
