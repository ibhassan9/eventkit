"use client";

import { useState, useCallback } from "react";
import { Button } from "@eventkit/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { TemplateList } from "@/components/email-builder/template-list";
import { TemplateForm } from "@/components/email-builder/template-form";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import {
  saveEmailTemplate,
  deleteEmailTemplateAction,
  sendEmailToAttendees,
} from "./actions";
import { generateEmailContent } from "./generate-action";

interface EmailsClientProps {
  eventId: string;
}

export function EmailsClient({ eventId }: EmailsClientProps) {
  const {
    data: templates,
    isLoading,
    error,
    refetch,
  } = useEmailTemplates(eventId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const selected = selectedId
    ? templates?.find((t) => t.id === selectedId)
    : null;

  const handleSave = useCallback(
    async (data: {
      eventId: string;
      templateId?: string;
      name: string;
      subject: string;
      body: string;
      type: string;
    }) => {
      const result = await saveEmailTemplate({
        ...data,
        type: data.type as "confirmation" | "reminder" | "update" | "custom",
      });
      if (result.success && result.data) {
        setSelectedId(result.data.id);
        setIsCreating(false);
        refetch();
      }
      return result;
    },
    [refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteEmailTemplateAction({
        eventId,
        templateId: id,
      });
      if (result.success) {
        if (selectedId === id) setSelectedId(null);
        refetch();
      }
      return result;
    },
    [eventId, selectedId, refetch]
  );

  const handleSend = useCallback(
    async (data: {
      eventId: string;
      templateId: string;
      recipientFilter: string;
    }) => {
      return sendEmailToAttendees({
        ...data,
        recipientFilter: data.recipientFilter as
          | "all"
          | "checked-in"
          | "not-checked-in",
      });
    },
    []
  );

  const handleGenerateAI = useCallback(
    async (data: { eventId: string; purpose: string }) => {
      return generateEmailContent({
        ...data,
        purpose: data.purpose as
          | "confirmation"
          | "reminder"
          | "update"
          | "custom",
      });
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-sm text-destructive">
        Failed to load email templates. Please try again.
      </div>
    );
  }

  if (selected || isCreating) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => {
            setSelectedId(null);
            setIsCreating(false);
            refetch();
          }}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to templates
        </Button>
        <TemplateForm
          eventId={eventId}
          templateId={selected?.id}
          initialName={selected?.name ?? ""}
          initialSubject={selected?.subject ?? ""}
          initialBody={selected?.body ?? ""}
          initialType={selected?.type ?? "custom"}
          onSave={handleSave}
          onGenerateAI={handleGenerateAI}
          onSend={selected ? handleSend : undefined}
        />
      </div>
    );
  }

  return (
    <TemplateList
      templates={templates ?? []}
      onSelect={setSelectedId}
      onNew={() => setIsCreating(true)}
      onDelete={handleDelete}
    />
  );
}
