"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { FaqData, FaqItem } from "@/types";

interface FaqEditorProps {
  data: FaqData;
  onChange: (data: FaqData) => void;
}

export function FaqEditor({ data, onChange }: FaqEditorProps) {
  function addItem() {
    onChange({ items: [...data.items, { question: "", answer: "" }] });
  }

  function removeItem(index: number) {
    onChange({ items: data.items.filter((_, i) => i !== index) });
  }

  function updateItem(index: number, patch: Partial<FaqItem>) {
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
          No FAQ items yet. Add your first question.
        </p>
      )}
      {data.items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-md border p-3"
        >
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Question</Label>
              <Input
                value={item.question}
                onChange={(e) =>
                  updateItem(index, { question: e.target.value })
                }
                placeholder="What time does the event start?"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Answer</Label>
              <Textarea
                value={item.answer}
                onChange={(e) =>
                  updateItem(index, { answer: e.target.value })
                }
                placeholder="The event starts at..."
                rows={2}
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
        Add FAQ
      </Button>
    </div>
  );
}
