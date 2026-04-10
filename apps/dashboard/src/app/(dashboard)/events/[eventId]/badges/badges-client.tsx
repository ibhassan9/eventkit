"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Card, CardContent } from "@eventkit/ui/card";
import { BadgeDesigner } from "@/components/badge-designer/badge-designer";
import { BADGE_PRESETS } from "@/components/badge-designer/preset-configs";
import type { BadgeConfig } from "@eventkit/types";
import { useBadgeTemplates } from "@/hooks/use-badge-templates";
import {
  saveBadgeTemplate,
  deleteBadgeTemplateAction,
} from "./actions";
import { generateBadgeDesign } from "./generate-action";
import { BadgeTemplateCard } from "./badge-template-card";

interface BadgesClientProps {
  eventId: string;
}

export function BadgesClient({ eventId }: BadgesClientProps) {
  const {
    data: templates,
    isLoading,
    error,
    refetch,
  } = useBadgeTemplates(eventId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const editing = editingId
    ? templates?.find((t) => t.id === editingId)
    : null;

  const handleSave = useCallback(
    async (data: {
      eventId: string;
      templateId?: string;
      name: string;
      config: BadgeConfig;
    }) => {
      const result = await saveBadgeTemplate(data);
      if (result.success && result.data) {
        setEditingId(result.data.id);
        setIsCreating(false);
        refetch();
      }
      return result;
    },
    [refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteBadgeTemplateAction({
        eventId,
        templateId: id,
      });
      if (result.success) {
        toast.success("Badge template deleted");
        refetch();
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    },
    [eventId, refetch]
  );

  const handleGenerateAI = useCallback(
    async (data: { eventId: string }) => {
      return generateBadgeDesign({ eventId: data.eventId });
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-sm text-destructive">
        Failed to load badge templates. Please try again.
      </div>
    );
  }

  if (editing || isCreating) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => {
            setEditingId(null);
            setIsCreating(false);
            refetch();
          }}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to templates
        </Button>
        <BadgeDesigner
          eventId={eventId}
          templateId={editing?.id}
          initialName={editing?.name ?? ""}
          initialConfig={editing?.config ?? BADGE_PRESETS.minimal}
          onSave={handleSave}
          onGenerateAI={handleGenerateAI}
        />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="mb-1 text-lg font-medium">No badge templates</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Design your first badge template for attendee check-in.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create Badge Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {templates.length} template{templates.length !== 1 ? "s" : ""}
        </h3>
        <Button size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Template
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t) => (
          <BadgeTemplateCard
            key={t.id}
            id={t.id}
            name={t.name}
            config={t.config}
            eventId={eventId}
            onEdit={setEditingId}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
