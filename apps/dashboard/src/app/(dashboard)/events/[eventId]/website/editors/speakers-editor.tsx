"use client";

import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { SpeakersData, Speaker } from "@eventkit/types";

interface SpeakersEditorProps {
  data: SpeakersData;
  onChange: (data: SpeakersData) => void;
}

export function SpeakersEditor({ data, onChange }: SpeakersEditorProps) {
  function addSpeaker() {
    onChange({
      speakers: [...data.speakers, { name: "", title: "", company: "" }],
    });
  }

  function removeSpeaker(index: number) {
    onChange({ speakers: data.speakers.filter((_, i) => i !== index) });
  }

  function updateSpeaker(index: number, patch: Partial<Speaker>) {
    onChange({
      speakers: data.speakers.map((s, i) =>
        i === index ? { ...s, ...patch } : s
      ),
    });
  }

  return (
    <div className="space-y-4">
      {data.speakers.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No speakers yet. Add your first speaker.
        </p>
      )}
      {data.speakers.map((speaker, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-md border p-3"
        >
          <div className="flex-1 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                  value={speaker.name}
                  onChange={(e) =>
                    updateSpeaker(index, { name: e.target.value })
                  }
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={speaker.title}
                  onChange={(e) =>
                    updateSpeaker(index, { title: e.target.value })
                  }
                  placeholder="CTO"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Company (optional)</Label>
              <Input
                value={speaker.company ?? ""}
                onChange={(e) =>
                  updateSpeaker(index, { company: e.target.value })
                }
                placeholder="Acme Corp"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeSpeaker(index)}
          >
            <Trash2 className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addSpeaker}>
        <Plus data-icon="inline-start" className="size-3.5" />
        Add Speaker
      </Button>
    </div>
  );
}
