"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Button } from "@eventkit/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@eventkit/ui/select";
import { Textarea } from "@eventkit/ui/textarea";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { FONT_LIST, MERGE_FIELDS } from "../constants";
import { PositionProperties } from "./position-properties";

interface TextPropertiesProps {
  element: BadgeElement;
}

export function TextProperties({ element }: TextPropertiesProps) {
  const { dispatch } = useEditor();

  const update = (changes: Partial<BadgeElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes });
  };

  const isMergeField = !!element.mergeField;

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm font-semibold text-stone-900">Text</div>

      {/* Content: Static vs Merge field */}
      <div className="space-y-2">
        <Label className="text-xs">Content</Label>
        <div className="flex gap-2">
          <Button
            variant={!isMergeField ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => update({ mergeField: undefined, text: element.text ?? "Text" })}
          >
            Static
          </Button>
          <Button
            variant={isMergeField ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => update({ mergeField: "{{fullName}}" })}
          >
            Merge Field
          </Button>
        </div>

        {isMergeField ? (
          <Select
            value={element.mergeField ?? "{{fullName}}"}
            onValueChange={(val) => { if (val) update({ mergeField: val }); }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MERGE_FIELDS.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Textarea
            value={element.text ?? ""}
            onChange={(e) => update({ text: e.target.value })}
            className="min-h-[60px] text-xs"
            placeholder="Enter text..."
          />
        )}
      </div>

      {/* Font */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Font</Label>
          <Select
            value={element.fontFamily ?? "Inter"}
            onValueChange={(val) => { if (val) update({ fontFamily: val }); }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_LIST.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Size</Label>
          <Input
            type="number"
            min={8}
            max={120}
            value={element.fontSize ?? 16}
            onChange={(e) =>
              update({ fontSize: Math.max(8, Number(e.target.value)) })
            }
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-1">
        <Label className="text-xs">Weight</Label>
        <div className="flex gap-1">
          {[400, 500, 600, 700].map((w) => (
            <Button
              key={w}
              variant={element.fontWeight === w ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => update({ fontWeight: w })}
            >
              {w}
            </Button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1">
        <Label className="text-xs">Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.fontColor ?? "#000000"}
            onChange={(e) => update({ fontColor: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={element.fontColor ?? "#000000"}
            onChange={(e) => update({ fontColor: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-1">
        <Label className="text-xs">Alignment</Label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <Button
              key={align}
              variant={element.textAlign === align ? "default" : "outline"}
              size="sm"
              className="flex-1 h-7"
              onClick={() => update({ textAlign: align })}
            >
              {align === "left" && <AlignLeft className="h-3.5 w-3.5" />}
              {align === "center" && <AlignCenter className="h-3.5 w-3.5" />}
              {align === "right" && <AlignRight className="h-3.5 w-3.5" />}
            </Button>
          ))}
        </div>
      </div>

      <PositionProperties element={element} />
    </div>
  );
}
