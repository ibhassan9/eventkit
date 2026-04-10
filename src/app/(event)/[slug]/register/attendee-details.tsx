"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomField } from "@/types";
import { CustomFieldInput } from "./custom-field-input";

interface AttendeeDetailsProps {
  firstName: string;
  lastName: string;
  email: string;
  customFields: CustomField[];
  customValues: Record<string, string>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCustomValueChange: (id: string, value: string) => void;
  primaryColor: string;
}

export function AttendeeDetails({
  firstName,
  lastName,
  email,
  customFields,
  customValues,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onCustomValueChange,
  primaryColor,
}: AttendeeDetailsProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2
        className="mb-5 text-lg font-semibold"
        style={{ color: primaryColor }}
      >
        Your Details
      </h2>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              required
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Jane"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              required
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="jane@example.com"
          />
        </div>
        {customFields
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <CustomFieldInput
              key={field.id}
              field={field}
              value={customValues[field.id] ?? ""}
              onChange={(val) => onCustomValueChange(field.id, val)}
            />
          ))}
      </div>
    </div>
  );
}
