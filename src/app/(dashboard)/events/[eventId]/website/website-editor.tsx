"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Save, Eye, Settings } from "lucide-react";
import type { WebsiteConfig } from "@/types";
import { saveWebsiteConfig, generateWebsiteConfig } from "./actions";
import { ThemeEditor } from "./theme-editor";
import { SectionList } from "./section-list";
import { WebsitePreview } from "./website-preview";

interface WebsiteEditorProps {
  eventId: string;
  eventSlug: string;
  initialConfig: WebsiteConfig;
}

export function WebsiteEditor({
  eventId,
  eventSlug,
  initialConfig,
}: WebsiteEditorProps) {
  const [config, setConfig] = useState<WebsiteConfig>(initialConfig);
  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [activeTab, setActiveTab] = useState("editor");

  function handleSave() {
    startSaving(async () => {
      const result = await saveWebsiteConfig({ eventId, config });
      if (result.success) {
        toast.success("Website saved successfully");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleGenerate() {
    startGenerating(async () => {
      const result = await generateWebsiteConfig({ eventId });
      if (result.success) {
        setConfig(result.data);
        toast.success("Website content generated with AI");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles data-icon="inline-start" className="size-3.5" />
            {isGenerating ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(`/${eventSlug}`, "_blank", "noopener")
            }
          >
            <Eye data-icon="inline-start" className="size-3.5" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save data-icon="inline-start" className="size-3.5" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">
            <Settings data-icon="inline-start" className="size-3.5" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye data-icon="inline-start" className="size-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-6">
              <ThemeEditor
                theme={config.theme}
                onChange={(theme) => setConfig({ ...config, theme })}
              />
              <SectionList
                sections={config.sections}
                onChange={(sections) => setConfig({ ...config, sections })}
              />
            </div>
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <WebsitePreview config={config} />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <WebsitePreview config={config} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
