"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SendControlsProps {
  eventId: string;
  templateId: string;
  onSend: (data: {
    eventId: string;
    templateId: string;
    recipientFilter: string;
  }) => Promise<{
    success: boolean;
    error?: string;
    data?: { sentCount: number };
  }>;
}

export function SendControls({
  eventId,
  templateId,
  onSend,
}: SendControlsProps) {
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [isSending, startSending] = useTransition();

  function handleSend() {
    startSending(async () => {
      const result = await onSend({ eventId, templateId, recipientFilter });
      if (result.success) {
        toast.success(
          `Emails sent to ${result.data?.sentCount ?? 0} recipients`
        );
      } else {
        toast.error(result.error ?? "Failed to send emails");
      }
    });
  }

  return (
    <>
      <Select
        value={recipientFilter}
        onValueChange={(v) => v !== null && setRecipientFilter(v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Attendees</SelectItem>
          <SelectItem value="checked-in">Checked In</SelectItem>
          <SelectItem value="not-checked-in">Not Checked In</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="secondary"
        onClick={handleSend}
        disabled={isSending}
      >
        {isSending ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-1.5 h-4 w-4" />
        )}
        Send
      </Button>
    </>
  );
}
