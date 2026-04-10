"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AboutData } from "@/types";

interface AboutEditorProps {
  data: AboutData;
  onChange: (data: AboutData) => void;
}

export function AboutEditor({ data, onChange }: AboutEditorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="about-content">Content</Label>
      <Textarea
        id="about-content"
        value={data.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Describe your event..."
        rows={6}
      />
      <p className="text-xs text-muted-foreground">
        Use line breaks to separate paragraphs.
      </p>
    </div>
  );
}
