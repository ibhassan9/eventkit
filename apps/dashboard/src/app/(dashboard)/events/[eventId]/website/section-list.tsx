"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@eventkit/ui/card";
import { Switch } from "@eventkit/ui/switch";
import { Label } from "@eventkit/ui/label";
import type { WebsiteSection } from "@eventkit/types";
import { SectionEditor } from "./section-editor";

const SECTION_LABELS: Record<WebsiteSection["type"], string> = {
  hero: "Hero",
  about: "About",
  schedule: "Schedule",
  speakers: "Speakers",
  location: "Location",
  faq: "FAQ",
};

interface SectionListProps {
  sections: WebsiteSection[];
  onChange: (sections: WebsiteSection[]) => void;
}

export function SectionList({ sections, onChange }: SectionListProps) {
  function handleToggle(index: number, enabled: boolean) {
    const updated = sections.map((s, i) =>
      i === index ? { ...s, enabled } : s
    ) as WebsiteSection[];
    onChange(updated);
  }

  function handleSectionChange(index: number, section: WebsiteSection) {
    const updated = sections.map((s, i) =>
      i === index ? section : s
    ) as WebsiteSection[];
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={section.type}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{SECTION_LABELS[section.type]}</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor={`toggle-${section.type}`} className="text-xs">
                  {section.enabled ? "Visible" : "Hidden"}
                </Label>
                <Switch
                  id={`toggle-${section.type}`}
                  checked={section.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle(index, checked as boolean)
                  }
                />
              </div>
            </div>
          </CardHeader>
          {section.enabled && (
            <CardContent>
              <SectionEditor
                section={section}
                onChange={(s) => handleSectionChange(index, s)}
              />
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
