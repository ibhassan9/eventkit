"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { CustomField } from "@/types";

const FIELD_TYPE_LABELS: Record<CustomField["type"], string> = {
  text: "Text",
  textarea: "Long Text",
  select: "Dropdown",
  checkbox: "Checkbox",
  radio: "Radio",
};

interface FieldEditorProps {
  field: CustomField;
  onChange: (patch: Partial<CustomField>) => void;
  onRemove: () => void;
}

export function FieldEditor({ field, onChange, onRemove }: FieldEditorProps) {
  const showOptions = field.type === "select" || field.type === "radio";

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input
                value={field.label}
                onChange={(e) => onChange({ label: e.target.value })}
                placeholder="Field label"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select
                value={field.type}
                onValueChange={(val) => {
                  if (val !== null) {
                    onChange({ type: val as CustomField["type"] });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {field.type !== "checkbox" && (
            <div className="space-y-1">
              <Label className="text-xs">Placeholder</Label>
              <Input
                value={field.placeholder ?? ""}
                onChange={(e) => onChange({ placeholder: e.target.value })}
                placeholder="Optional placeholder text"
              />
            </div>
          )}
          {showOptions && (
            <div className="space-y-1">
              <Label className="text-xs">
                Options (comma-separated)
              </Label>
              <Input
                value={field.options?.join(", ") ?? ""}
                onChange={(e) =>
                  onChange({
                    options: e.target.value
                      .split(",")
                      .map((o) => o.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch
              id={`required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) =>
                onChange({ required: checked as boolean })
              }
              size="sm"
            />
            <Label htmlFor={`required-${field.id}`} className="text-xs">
              Required
            </Label>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onRemove}>
          <Trash2 className="size-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
