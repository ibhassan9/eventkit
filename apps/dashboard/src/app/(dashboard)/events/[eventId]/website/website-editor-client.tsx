"use client";

import { Loader2 } from "lucide-react";
import { useWebsiteConfig } from "@/hooks/use-website-config";
import { defaultWebsiteConfig } from "./default-config";
import { WebsiteEditor } from "./website-editor";

interface WebsiteEditorClientProps {
  eventId: string;
}

export function WebsiteEditorClient({ eventId }: WebsiteEditorClientProps) {
  const { data, isLoading, error } = useWebsiteConfig(eventId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Event Website</h1>
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
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Event Website</h1>
        </div>
        <div className="py-24 text-center text-sm text-destructive">
          Failed to load website config. Please try again.
        </div>
      </div>
    );
  }

  const config = data.websiteConfig ?? defaultWebsiteConfig(data.eventName);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Event Website</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Design your public event page. Visitors will see this at{" "}
          <span className="font-medium text-foreground">
            eventkit.app/{data.eventSlug}
          </span>
        </p>
      </div>
      <WebsiteEditor
        eventId={eventId}
        eventSlug={data.eventSlug}
        initialConfig={config}
      />
    </div>
  );
}
