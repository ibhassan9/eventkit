"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateEventInput } from "@/lib/validators";

interface EventFormFieldsProps {
  register: UseFormRegister<CreateEventInput>;
  errors: FieldErrors<CreateEventInput>;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EventFormFields({
  register,
  errors,
  onNameChange,
}: EventFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="event-name">Event Name</Label>
        <Input
          id="event-name"
          placeholder="My Conference 2026"
          {...register("name")}
          onChange={onNameChange}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          placeholder="Describe your event..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-venue">Venue</Label>
          <Input
            id="event-venue"
            placeholder="Convention Center"
            {...register("venue")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-address">Address</Label>
          <Input
            id="event-address"
            placeholder="123 Main St"
            {...register("address")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-start">Start Date & Time</Label>
          <Input
            id="event-start"
            type="datetime-local"
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-end">End Date & Time</Label>
          <Input
            id="event-end"
            type="datetime-local"
            {...register("endDate")}
          />
          {errors.endDate && (
            <p className="text-xs text-destructive">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-max-attendees">Max Attendees (optional)</Label>
        <Input
          id="event-max-attendees"
          type="number"
          min={1}
          placeholder="Unlimited"
          {...register("maxAttendees", { valueAsNumber: true })}
        />
      </div>
    </>
  );
}
