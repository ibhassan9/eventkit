"use client";

import { Loader2 } from "lucide-react";
import { useRegistrationConfig } from "@/hooks/use-registration-config";
import { RegistrationBuilder } from "./registration-builder";

interface RegistrationBuilderClientProps {
  eventId: string;
}

export function RegistrationBuilderClient({
  eventId,
}: RegistrationBuilderClientProps) {
  const { data, isLoading, error } = useRegistrationConfig(eventId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Registration Form
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Registration Form
          </h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load registration config. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Registration Form
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the registration form for {data.eventName}. Default fields
          (name and email) are always included.
        </p>
      </div>
      <RegistrationBuilder eventId={eventId} initialFields={data.fields} />
    </div>
  );
}
