"use client";

import { useState } from "react";
import { Button } from "@eventkit/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@eventkit/ui/tabs";
import { ExternalLink, Copy, Check } from "lucide-react";
import type { WebsitePages } from "@eventkit/types";
import { PagesTab } from "./pages-tab";
import { SettingsTab } from "./settings-tab";

interface WebsiteDashboardProps {
  eventId: string;
  websitePages: WebsitePages;
  eventSlug: string;
  onEditContent: () => void;
  onWebsitePagesChange: (pages: WebsitePages) => void;
}

export function WebsiteDashboard({
  eventId,
  websitePages,
  eventSlug,
  onEditContent,
  onWebsitePagesChange,
}: WebsiteDashboardProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${eventSlug}`;

  function handleCopy() {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Website</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your public event pages and settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <Copy className="mr-1.5 h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy URL"}
          </Button>
          <Button
            size="sm"
            onClick={() =>
              window.open(`/${eventSlug}`, "_blank", "noopener")
            }
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="pages" className="mt-4">
          <PagesTab
            eventId={eventId}
            websitePages={websitePages}
            onWebsitePagesChange={onWebsitePagesChange}
            onEditContent={onEditContent}
          />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <SettingsTab
            eventId={eventId}
            websitePages={websitePages}
            onWebsitePagesChange={onWebsitePagesChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
