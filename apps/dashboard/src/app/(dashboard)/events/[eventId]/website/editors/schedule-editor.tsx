"use client";

import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ScheduleData, ScheduleItem } from "@eventkit/types";

interface ScheduleEditorProps {
  data: ScheduleData;
  onChange: (data: ScheduleData) => void;
}

export function ScheduleEditor({ data, onChange }: ScheduleEditorProps) {
  function addItem() {
    onChange({
      items: [...data.items, { time: "", title: "", description: "" }],
    });
  }

  function removeItem(index: number) {
    onChange({ items: data.items.filter((_, i) => i !== index) });
  }

  function updateItem(index: number, patch: Partial<ScheduleItem>) {
    onChange({
      items: data.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    });
  }

  return (
    <div className="space-y-4">
      {data.items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No schedule items yet. Add your first session.
        </p>
      )}
      {data.items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-md border p-3"
        >
          <div className="flex-1 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Time</Label>
                <Input
                  value={item.time}
                  onChange={(e) => updateItem(index, { time: e.target.value })}
                  placeholder="9:00 AM"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  placeholder="Session title"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description (optional)</Label>
              <Input
                value={item.description ?? ""}
                onChange={(e) =>
                  updateItem(index, { description: e.target.value })
                }
                placeholder="Brief description"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus data-icon="inline-start" className="size-3.5" />
        Add Session
      </Button>
    </div>
  );
}
