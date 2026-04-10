"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Card, CardContent } from "@eventkit/ui/card";
import { BadgeDesigner } from "@/components/badge-designer/badge-designer";
import { BADGE_PRESETS } from "@/components/badge-designer/preset-configs";
import type { BadgeConfig } from "@eventkit/types";
import { saveBadgeTemplate, deleteBadgeTemplateAction } from "./actions";
import { generateBadgeDesign } from "./generate-action";
import { BadgeTemplateCard } from "./badge-template-card";

interface BadgeTemplate {
  id: string;
  name: string;
  config: BadgeConfig;
  isDefault: boolean;
}

interface BadgesClientProps {
  eventId: string;
  initialTemplates: BadgeTemplate[];
}

export function BadgesClient({ eventId, initialTemplates }: BadgesClientProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const editing = editingId ? templates.find((t) => t.id === editingId) : null;

  const handleSave = useCallback(async (data: {
    eventId: string; templateId?: string; name: string; config: BadgeConfig;
  }) => {
    const result = await saveBadgeTemplate(data);
    if (result.success && result.data) {
      const s = result.data;
      const entry = { id: s.id, name: s.name, config: s.config, isDefault: s.isDefault };
      setTemplates((prev) =>
        prev.some((t) => t.id === s.id) ? prev.map((t) => (t.id === s.id ? entry : t)) : [...prev, entry]
      );
      setEditingId(s.id);
      setIsCreating(false);
    }
    return result;
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteBadgeTemplateAction({ eventId, templateId: id });
    if (result.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Badge template deleted");
    } else {
      toast.error(result.error ?? "Failed to delete");
    }
  }, [eventId]);

  const handleGenerateAI = useCallback(async (data: { eventId: string }) => {
    return generateBadgeDesign({ eventId: data.eventId });
  }, []);

  if (editing || isCreating) {
    return (
      <div>
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => {
          setEditingId(null);
          setIsCreating(false);
          router.refresh();
        }}>
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

  if (templates.length === 0) {
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
