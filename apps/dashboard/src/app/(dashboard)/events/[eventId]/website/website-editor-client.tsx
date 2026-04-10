"use client";

import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { useWebsiteConfig } from "@/hooks/use-website-config";
import { useWebsitePages } from "@/hooks/use-website-pages";
import { defaultWebsiteConfig } from "@eventkit/lib/default-website-config";
import { defaultWebsitePages } from "@eventkit/lib/default-website-pages";
import type { WebsitePages } from "@eventkit/types";
import { WebsiteEditor } from "./website-editor";
import { WebsiteDashboard } from "./website-dashboard";

interface WebsiteEditorClientProps {
  eventId: string;
}

export function WebsiteEditorClient({ eventId }: WebsiteEditorClientProps) {
  const configQuery = useWebsiteConfig(eventId);
  const pagesQuery = useWebsitePages(eventId);
  const [view, setView] = useState<"dashboard" | "editor">("dashboard");
  const [localPages, setLocalPages] = useState<WebsitePages | null>(null);

  const isLoading = configQuery.isLoading || pagesQuery.isLoading;
  const error = configQuery.error || pagesQuery.error;

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

  if (error || !configQuery.data || !pagesQuery.data) {
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

  const config = configQuery.data.websiteConfig ?? defaultWebsiteConfig(configQuery.data.eventName);
  const websitePages = localPages ?? pagesQuery.data.websitePages ?? defaultWebsitePages();
  const eventSlug = configQuery.data.eventSlug;

  if (view === "editor") {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("dashboard")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </div>
        <WebsiteEditor
          eventId={eventId}
          eventSlug={eventSlug}
          initialConfig={config}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <WebsiteDashboard
        eventId={eventId}
        websitePages={websitePages}
        eventSlug={eventSlug}
        onEditContent={() => setView("editor")}
        onWebsitePagesChange={setLocalPages}
      />
    </div>
  );
}
