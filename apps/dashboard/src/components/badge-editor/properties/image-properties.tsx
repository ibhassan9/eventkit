"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Button } from "@eventkit/ui/button";
import { ImagePlus } from "lucide-react";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { PositionProperties } from "./position-properties";

interface ImagePropertiesProps {
  element: BadgeElement;
}

export function ImageProperties({ element }: ImagePropertiesProps) {
  const { dispatch } = useEditor();

  const update = (changes: Partial<BadgeElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes });
  };

  const replaceImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      update({ src: url });
    };
    input.click();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm font-semibold text-stone-900">Image</div>

      {/* Preview */}
      {element.src && (
        <div className="rounded-lg border bg-stone-50 p-2">
          <img
            src={element.src}
            alt="Badge element"
            className="h-20 w-full object-contain rounded"
          />
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={replaceImage}
      >
        <ImagePlus className="h-3.5 w-3.5" />
        Replace Image
      </Button>

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

      {/* Corner Radius */}
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

      <PositionProperties element={element} />
    </div>
  );
}
