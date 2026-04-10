"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@eventkit/ui/button";
import { ArrowLeft } from "lucide-react";
import { TemplateList } from "@/components/email-builder/template-list";
import { TemplateForm } from "@/components/email-builder/template-form";
import {
  saveEmailTemplate,
  deleteEmailTemplateAction,
  sendEmailToAttendees,
} from "./actions";
import { generateEmailContent } from "./generate-action";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
}

interface EmailsClientProps {
  eventId: string;
  initialTemplates: EmailTemplate[];
}

export function EmailsClient({ eventId, initialTemplates }: EmailsClientProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const selected = selectedId ? templates.find((t) => t.id === selectedId) : null;

  const handleSave = useCallback(async (data: {
    eventId: string; templateId?: string; name: string;
    subject: string; body: string; type: string;
  }) => {
    const result = await saveEmailTemplate({
      ...data,
      type: data.type as "confirmation" | "reminder" | "update" | "custom",
    });
    if (result.success && result.data) {
      const d = result.data;
      setTemplates((prev) => {
        const entry = { id: d.id, name: d.name, subject: d.subject, body: d.body, type: d.type };
        return prev.some((t) => t.id === d.id)
          ? prev.map((t) => (t.id === d.id ? entry : t))
          : [...prev, entry];
      });
      setSelectedId(d.id);
      setIsCreating(false);
    }
    return result;
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteEmailTemplateAction({ eventId, templateId: id });
    if (result.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
    return result;
  }, [eventId, selectedId]);

  const handleSend = useCallback(async (data: {
    eventId: string; templateId: string; recipientFilter: string;
  }) => {
    return sendEmailToAttendees({
      ...data,
      recipientFilter: data.recipientFilter as "all" | "checked-in" | "not-checked-in",
    });
  }, []);

  const handleGenerateAI = useCallback(async (data: {
    eventId: string; purpose: string;
  }) => {
    return generateEmailContent({
      ...data,
      purpose: data.purpose as "confirmation" | "reminder" | "update" | "custom",
    });
  }, []);

  if (selected || isCreating) {
    return (
      <div>
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => {
          setSelectedId(null);
          setIsCreating(false);
          router.refresh();
        }}>
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
      templates={templates}
      onSelect={setSelectedId}
      onNew={() => setIsCreating(true)}
      onDelete={handleDelete}
    />
  );
}
