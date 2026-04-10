"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@eventkit/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@eventkit/ui/card";
import { Label } from "@eventkit/ui/label";
import { Save, Sparkles, Plus } from "lucide-react";
import type { CustomField } from "@eventkit/types";
import { saveRegistrationConfig, suggestRegistrationFields } from "./actions";
import { FieldEditor } from "./field-editor";

interface RegistrationBuilderProps {
  eventId: string;
  initialFields: CustomField[];
}

export function RegistrationBuilder({
  eventId,
  initialFields,
}: RegistrationBuilderProps) {
  const [fields, setFields] = useState<CustomField[]>(initialFields);
  const [isSaving, startSaving] = useTransition();
  const [isSuggesting, startSuggesting] = useTransition();

  function handleSave() {
    startSaving(async () => {
      const result = await saveRegistrationConfig({
        eventId,
        config: { fields },
      });
      if (result.success) {
        toast.success("Registration form saved");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleSuggest() {
    startSuggesting(async () => {
      const result = await suggestRegistrationFields({ eventId });
      if (result.success) {
        setFields(result.data);
        toast.success("AI suggested custom fields");
      } else {
        toast.error(result.error);
      }
    });
  }

  function addField() {
    const newField: CustomField = {
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
  }

  function updateField(id: string, patch: Partial<CustomField>) {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, ...patch } : f))
    );
  }

  function removeField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={isSuggesting}
        >
          <Sparkles data-icon="inline-start" className="size-3.5" />
          {isSuggesting ? "Generating..." : "Suggest with AI"}
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          <Save data-icon="inline-start" className="size-3.5" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DefaultField label="First Name" />
          <DefaultField label="Last Name" />
          <DefaultField label="Email" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Custom Fields</CardTitle>
            <Button variant="outline" size="sm" onClick={addField}>
              <Plus data-icon="inline-start" className="size-3.5" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No custom fields. Add one or use AI to suggest fields.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  onChange={(patch) => updateField(field.id, patch)}
                  onRemove={() => removeField(field.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DefaultField({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2">
      <Label className="text-sm">{label}</Label>
      <span className="ml-auto text-xs text-muted-foreground">Required</span>
    </div>
  );
}
