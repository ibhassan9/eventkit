"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { BadgeConfig } from "@eventkit/types";
import { BadgePreview } from "./badge-preview";
import { ConfigPanel } from "./config-panel";

interface BadgeDesignerProps {
  eventId: string;
  templateId?: string;
  initialName: string;
  initialConfig: BadgeConfig;
  onSave: (data: {
    eventId: string;
    templateId?: string;
    name: string;
    config: BadgeConfig;
  }) => Promise<{ success: boolean; error?: string }>;
  onGenerateAI: (data: {
    eventId: string;
  }) => Promise<{
    success: boolean;
    data?: { config: BadgeConfig };
    error?: string;
  }>;
}

export function BadgeDesigner({
  eventId,
  templateId,
  initialName,
  initialConfig,
  onSave,
  onGenerateAI,
}: BadgeDesignerProps) {
  const [name, setName] = useState(initialName);
  const [config, setConfig] = useState<BadgeConfig>(initialConfig);
  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();

  function handleSave() {
    startSaving(async () => {
      const result = await onSave({ eventId, templateId, name, config });
      if (result.success) {
        toast.success("Badge template saved");
      } else {
        toast.error(result.error ?? "Failed to save badge template");
      }
    });
  }

  function handleGenerate() {
    startGenerating(async () => {
      const result = await onGenerateAI({ eventId });
      if (result.success && result.data) {
        setConfig(result.data.config);
        toast.success("Badge design generated");
      } else {
        toast.error(result.error ?? "Failed to generate design");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ConfigPanel
        name={name}
        onNameChange={setName}
        config={config}
        onConfigChange={setConfig}
        onSave={handleSave}
        onGenerate={handleGenerate}
        isSaving={isSaving}
        isGenerating={isGenerating}
      />
      <div className="sticky top-4">
        <BadgePreview config={config} />
      </div>
    </div>
  );
}
