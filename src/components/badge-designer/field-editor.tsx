"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BadgeField } from "@/types";

interface FieldEditorProps {
  field: BadgeField;
  onChange: (updated: BadgeField) => void;
  onRemove: () => void;
}

const FIELD_TYPES: { value: BadgeField["type"]; label: string }[] = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "fullName", label: "Full Name" },
  { value: "company", label: "Company" },
  { value: "jobTitle", label: "Job Title" },
  { value: "ticketType", label: "Ticket Type" },
  { value: "custom", label: "Custom" },
];

export function FieldEditor({ field, onChange, onRemove }: FieldEditorProps) {
  return (
    <div className="space-y-2 rounded-md border bg-card p-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Field</Label>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select
          value={field.type}
          onValueChange={(v) =>
            onChange({ ...field, type: v as BadgeField["type"] })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((ft) => (
              <SelectItem key={ft.value} value={ft.value}>
                {ft.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          className="h-8 text-xs"
          value={field.fontSize}
          onChange={(e) =>
            onChange({ ...field, fontSize: Number(e.target.value) || 12 })
          }
          min={8}
          max={48}
          placeholder="Font size"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Select
          value={field.fontWeight}
          onValueChange={(v) =>
            onChange({ ...field, fontWeight: v as "normal" | "bold" })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={field.textAlign}
          onValueChange={(v) =>
            onChange({ ...field, textAlign: v as "left" | "center" | "right" })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="color"
          className="h-8 w-full cursor-pointer p-0.5"
          value={field.color ?? "#000000"}
          onChange={(e) => onChange({ ...field, color: e.target.value })}
        />
      </div>
    </div>
  );
}
