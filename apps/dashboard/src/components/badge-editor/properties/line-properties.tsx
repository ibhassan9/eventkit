"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Button } from "@eventkit/ui/button";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { PositionProperties } from "./position-properties";

interface LinePropertiesProps {
  element: BadgeElement;
}

export function LineProperties({ element }: LinePropertiesProps) {
  const { dispatch } = useEditor();

  const update = (changes: Partial<BadgeElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm font-semibold text-stone-900">Line</div>

      {/* Stroke Color */}
      <div className="space-y-1">
        <Label className="text-xs">Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.stroke ?? "#d6d3d1"}
            onChange={(e) => update({ stroke: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={element.stroke ?? "#d6d3d1"}
            onChange={(e) => update({ stroke: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div className="space-y-1">
        <Label className="text-xs">Thickness</Label>
        <Input
          type="number"
          min={1}
          max={20}
          value={element.strokeWidth ?? 1}
          onChange={(e) =>
            update({ strokeWidth: Number(e.target.value) })
          }
          className="h-8 text-xs"
        />
      </div>

      {/* Dash Pattern */}
      <div className="space-y-1">
        <Label className="text-xs">Style</Label>
        <div className="flex gap-1">
          <Button
            variant={!element.dashPattern ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => update({ dashPattern: undefined })}
          >
            Solid
          </Button>
          <Button
            variant={
              element.dashPattern?.[0] === 8 ? "default" : "outline"
            }
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => update({ dashPattern: [8, 4] })}
          >
            Dashed
          </Button>
          <Button
            variant={
              element.dashPattern?.[0] === 2 ? "default" : "outline"
            }
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => update({ dashPattern: [2, 4] })}
          >
            Dotted
          </Button>
        </div>
      </div>

      {/* Length */}
      <div className="space-y-1">
        <Label className="text-xs">Length</Label>
        <Input
          type="number"
          min={10}
          value={Math.round(element.width)}
          onChange={(e) =>
            update({ width: Math.max(10, Number(e.target.value)) })
          }
          className="h-8 text-xs"
        />
      </div>

      <PositionProperties element={element} />
    </div>
  );
}
