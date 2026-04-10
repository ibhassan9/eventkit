"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { CustomField } from "@/types";

interface CustomFieldInputProps {
  field: CustomField;
  value: string;
  onChange: (value: string) => void;
}

export function CustomFieldInput({
  field,
  value,
  onChange,
}: CustomFieldInputProps) {
  const fieldId = `custom-${field.id}`;
  const requiredMark = field.required ? " *" : "";

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>
            {field.label}
            {requiredMark}
          </Label>
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>
            {field.label}
            {requiredMark}
          </Label>
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {requiredMark}
          </Label>
          <Select value={value} onValueChange={(v) => v !== null && onChange(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-3">
          <Checkbox
            id={fieldId}
            checked={value === "true"}
            onCheckedChange={(checked) =>
              onChange(String(checked))
            }
          />
          <Label htmlFor={fieldId}>
            {field.label}
            {requiredMark}
          </Label>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {requiredMark}
          </Label>
          <RadioGroup value={value} onValueChange={onChange}>
            {(field.options ?? []).map((option) => (
              <div key={option} className="flex items-center gap-2">
                <RadioGroupItem value={option} id={`${fieldId}-${option}`} />
                <Label htmlFor={`${fieldId}-${option}`} className="font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
  }
}
