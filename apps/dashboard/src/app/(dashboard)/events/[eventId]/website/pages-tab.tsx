"use client";

import { Home, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import type { WebsitePages } from "@eventkit/types";
import { useSaveWebsitePages } from "@/hooks/use-website-pages";
import { PageCard } from "./page-card";

interface PagesTabProps {
  eventId: string;
  websitePages: WebsitePages;
  onWebsitePagesChange: (pages: WebsitePages) => void;
  onEditContent: () => void;
}

export function PagesTab({
  eventId,
  websitePages,
  onWebsitePagesChange,
  onEditContent,
}: PagesTabProps) {
  const saveMutation = useSaveWebsitePages();

  function save(updated: WebsitePages) {
    onWebsitePagesChange(updated);
    saveMutation.mutate(
      { eventId, websitePages: updated },
      {
        onError: () => {
          toast.error("Failed to save changes");
        },
      }
    );
  }

  function handleHomeTitle(title: string) {
    save({
      ...websitePages,
      pages: {
        ...websitePages.pages,
        home: { ...websitePages.pages.home, title },
      },
    });
  }

  function handleScheduleTitle(title: string) {
    save({
      ...websitePages,
      pages: {
        ...websitePages.pages,
        schedule: { ...websitePages.pages.schedule, title },
      },
    });
  }

  function handleScheduleVisible(visible: boolean) {
    save({
      ...websitePages,
      pages: {
        ...websitePages.pages,
        schedule: { ...websitePages.pages.schedule, visible },
      },
    });
  }

  function handleSpeakersTitle(title: string) {
    save({
      ...websitePages,
      pages: {
        ...websitePages.pages,
        speakers: { ...websitePages.pages.speakers, title },
      },
    });
  }

  function handleSpeakersVisible(visible: boolean) {
    save({
      ...websitePages,
      pages: {
        ...websitePages.pages,
        speakers: { ...websitePages.pages.speakers, visible },
      },
    });
  }

  return (
    <div className="space-y-3">
      <PageCard
        icon={Home}
        title={websitePages.pages.home.title}
        onTitleChange={handleHomeTitle}
        description="Hero, About, Location, FAQ"
        actionLabel="Edit Content"
        onAction={onEditContent}
      />

      <PageCard
        icon={Calendar}
        title={websitePages.pages.schedule.title}
        onTitleChange={handleScheduleTitle}
        description="Auto-generated from your sessions"
        visible={websitePages.pages.schedule.visible}
        onVisibleChange={handleScheduleVisible}
        actionLabel="Manage Sessions"
        actionHref={`/events/${eventId}/schedule`}
      />

      <PageCard
        icon={Users}
        title={websitePages.pages.speakers.title}
        onTitleChange={handleSpeakersTitle}
        description="Auto-generated from your speakers"
        visible={websitePages.pages.speakers.visible}
        onVisibleChange={handleSpeakersVisible}
        actionLabel="Manage Speakers"
        actionHref={`/events/${eventId}/speakers`}
      />
    </div>
  );
}
