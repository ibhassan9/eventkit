"use client";

import { toast } from "sonner";
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
import { useOfferWaitlistSpot } from "@/hooks/use-waitlist";

interface OfferSpotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    ticketType: { name: string } | null;
  };
  eventId: string;
}

export function OfferSpotDialog({
  open,
  onOpenChange,
  entry,
  eventId,
}: OfferSpotDialogProps) {
  const offerMutation = useOfferWaitlistSpot();

  async function handleOffer() {
    const result = await offerMutation.mutateAsync({
      eventId,
      entryId: entry.id,
      expiresInHours: 48,
    });
    if (result.success) {
      toast.success(
        `Spot offered to ${entry.firstName} ${entry.lastName}. They have 48 hours to accept.`
      );
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Offer spot to waitlisted attendee</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              This will send an email to{" "}
              <strong>
                {entry.firstName} {entry.lastName}
              </strong>{" "}
              ({entry.email}) offering them a spot for{" "}
              <strong>{entry.ticketType?.name ?? "this ticket"}</strong>.
            </span>
            <span className="mt-2 block">
              They will have 48 hours to accept before the offer expires.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={handleOffer}
          >
            Offer Spot
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
