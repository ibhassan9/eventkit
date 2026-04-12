"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Button } from "@eventkit/ui/button";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { PositionProperties } from "./position-properties";

interface ShapePropertiesProps {
  element: BadgeElement;
}

export function ShapeProperties({ element }: ShapePropertiesProps) {
  const { dispatch } = useEditor();

  const update = (changes: Partial<BadgeElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm font-semibold text-stone-900">Shape</div>

      {/* Shape Type */}
      <div className="space-y-1">
        <Label className="text-xs">Type</Label>
        <div className="flex gap-1">
          {(["rect", "roundedRect", "circle"] as const).map((type) => (
            <Button
              key={type}
              variant={element.shapeType === type ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => update({ shapeType: type })}
            >
              {type === "rect"
                ? "Rect"
                : type === "roundedRect"
                  ? "Rounded"
                  : "Circle"}
            </Button>
          ))}
        </div>
      </div>

      {/* Fill Color */}
      <div className="space-y-1">
        <Label className="text-xs">Fill Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.fill ?? "#e7e5e4"}
            onChange={(e) => update({ fill: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={element.fill ?? "#e7e5e4"}
            onChange={(e) => update({ fill: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Stroke Color */}
      <div className="space-y-1">
        <Label className="text-xs">Border Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.stroke ?? "#000000"}
            onChange={(e) => update({ stroke: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={element.stroke ?? "#000000"}
            onChange={(e) => update({ stroke: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div className="space-y-1">
        <Label className="text-xs">Border Width</Label>
        <Input
          type="number"
          min={0}
          max={20}
          value={element.strokeWidth ?? 0}
          onChange={(e) =>
            update({ strokeWidth: Number(e.target.value) })
          }
          className="h-8 text-xs"
        />
      </div>

      {/* Corner Radius (for rect/roundedRect) */}
      {element.shapeType !== "circle" && (
        <div className="space-y-1">
          <Label className="text-xs">Corner Radius</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={element.cornerRadius ?? 0}
            onChange={(e) =>
              update({ cornerRadius: Number(e.target.value) })
            }
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Opacity */}
      <div className="space-y-1">
        <Label className="text-xs">
          Opacity: {Math.round((element.opacity ?? 1) * 100)}%
        </Label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((element.opacity ?? 1) * 100)}
          onChange={(e) =>
            update({ opacity: Number(e.target.value) / 100 })
          }
          className="w-full"
        />
      </div>

      <PositionProperties element={element} />
    </div>
  );
}
