"use client";

import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { ExternalLink, Copy } from "lucide-react";

interface EventOverviewActionsProps {
  eventSlug: string;
  eventId: string;
}

export function EventOverviewActions({
  eventSlug,
}: EventOverviewActionsProps) {
  const registrationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${eventSlug}`
      : `/e/${eventSlug}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(registrationUrl);
    toast.success("Registration link copied to clipboard");
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        <Copy className="mr-1.5 h-3.5 w-3.5" />
        Copy Link
      </Button>
      <a
        href={`/e/${eventSlug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
      </a>
    </div>
  );
}
