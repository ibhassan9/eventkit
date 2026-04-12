"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@eventkit/ui/dialog";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { joinWaitlist } from "./actions";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketTypeId: string;
  ticketTypeName: string;
  eventId: string;
  eventSlug: string;
}

export function WaitlistModal({
  open,
  onOpenChange,
  ticketTypeId,
  ticketTypeName,
  eventId,
  eventSlug,
}: WaitlistModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    position: number;
  } | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setError(null);
      setSuccess(null);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await joinWaitlist({
        eventId,
        ticketTypeId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
      });

      if (result.success) {
        setSuccess({ position: result.data.position });
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle>You are on the waitlist!</DialogTitle>
              <DialogDescription>
                You are #{success.position} on the waitlist for{" "}
                {ticketTypeName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-6 pb-6">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">
                  #{success.position}
                </p>
                <p className="mt-1 text-sm text-amber-600">
                  Your waitlist position
                </p>
              </div>
              <p className="text-sm text-zinc-500 text-center">
                We will email you when a spot opens up. Keep an eye on your
                inbox!
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Join Waitlist</DialogTitle>
              <DialogDescription>
                {ticketTypeName} is currently sold out. Join the waitlist and
                we will notify you when a spot opens up.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="wl-first-name">First name</Label>
                  <Input
                    id="wl-first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wl-last-name">Last name</Label>
                  <Input
                    id="wl-last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wl-email">Email</Label>
                <Input
                  id="wl-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
