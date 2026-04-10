"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  ticketType?: { name: string } | null;
  checkedInAt: string | null;
}

interface AttendeeCardProps {
  attendee: Attendee;
  onCheckIn: (
    attendeeId: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export function AttendeeCard({ attendee, onCheckIn }: AttendeeCardProps) {
  const [isPending, startTransition] = useTransition();
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const alreadyCheckedIn = !!attendee.checkedInAt;

  function handleCheckIn() {
    startTransition(async () => {
      const result = await onCheckIn(attendee.id);
      if (result.success) {
        setJustCheckedIn(true);
        toast.success(`${attendee.firstName} checked in`);
      } else {
        toast.error(result.error ?? "Check-in failed");
      }
    });
  }

  const showSuccess = justCheckedIn && !alreadyCheckedIn;

  return (
    <Card
      className={
        showSuccess
          ? "border-green-500 bg-green-50 transition-colors duration-300"
          : alreadyCheckedIn
            ? "border-amber-300 bg-amber-50"
            : ""
      }
    >
      <CardContent className="flex items-center gap-4 p-4 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-bold sm:text-2xl">
            {attendee.firstName} {attendee.lastName}
          </p>
          <p className="truncate text-sm text-muted-foreground sm:text-base">
            {attendee.email}
          </p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs sm:text-sm">
            {attendee.company && (
              <span className="text-muted-foreground">{attendee.company}</span>
            )}
            {attendee.ticketType && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                {attendee.ticketType.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          {showSuccess ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white animate-in zoom-in">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
          ) : alreadyCheckedIn ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-white">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <span className="text-center text-[10px] leading-tight text-amber-700">
                Checked in
                <br />
                {formatDate(attendee.checkedInAt!)}
              </span>
            </div>
          ) : (
            <Button
              size="lg"
              className="h-14 min-w-[120px] text-lg font-bold"
              onClick={handleCheckIn}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "CHECK IN"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
