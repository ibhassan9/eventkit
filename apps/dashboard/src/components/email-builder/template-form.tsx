"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@eventkit/ui/select";
import { EmailEditor } from "./email-editor";
import { EmailPreview } from "./email-preview";
import { SendControls } from "./send-controls";

interface TemplateFormProps {
  eventId: string;
  templateId?: string;
  initialName: string;
  initialSubject: string;
  initialBody: string;
  initialType: string;
  onSave: (data: {
    eventId: string;
    templateId?: string;
    name: string;
    subject: string;
    body: string;
    type: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onGenerateAI: (data: {
    eventId: string;
    purpose: string;
  }) => Promise<{
    success: boolean;
    data?: { subject: string; body: string };
    error?: string;
  }>;
  onSend?: (data: {
    eventId: string;
    templateId: string;
    recipientFilter: string;
  }) => Promise<{
    success: boolean;
    error?: string;
    data?: { sentCount: number };
  }>;
}

export function TemplateForm({
  eventId,
  templateId,
  initialName,
  initialSubject,
  initialBody,
  initialType,
  onSave,
  onGenerateAI,
  onSend,
}: TemplateFormProps) {
  const [name, setName] = useState(initialName);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [type, setType] = useState(initialType);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();

  function handleSave() {
    startSaving(async () => {
      const result = await onSave({
        eventId, templateId, name, subject, body, type,
      });
      if (result.success) toast.success("Template saved");
      else toast.error(result.error ?? "Failed to save template");
    });
  }

  function handleGenerate() {
    startGenerating(async () => {
      const result = await onGenerateAI({ eventId, purpose: type });
      if (result.success && result.data) {
        setSubject(result.data.subject);
        setBody(result.data.body);
        toast.success("Email content generated");
      } else {
        toast.error(result.error ?? "Failed to generate content");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Registration Confirmation"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-type">Type</Label>
          <Select
            value={type}
            onValueChange={(v) => v !== null && setType(v)}
          >
            <SelectTrigger id="template-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmation">Confirmation</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-subject">Subject Line</Label>
        <Input
          id="template-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Your registration for {{eventName}} is confirmed!"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
          {showPreview ? "Edit" : "Preview"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
          Write with AI
        </Button>
      </div>

      {showPreview ? (
        <EmailPreview subject={subject} body={body} />
      ) : (
        <EmailEditor content={body} onChange={setBody} />
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          Save Template
        </Button>
        {templateId && onSend && (
          <SendControls eventId={eventId} templateId={templateId} onSend={onSend} />
        )}
      </div>
    </div>
  );
}
