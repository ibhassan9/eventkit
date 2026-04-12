"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { PositionProperties } from "./position-properties";

interface QrPropertiesProps {
  element: BadgeElement;
}

export function QrProperties({ element }: QrPropertiesProps) {
  const { dispatch } = useEditor();

  const update = (changes: Partial<BadgeElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm font-semibold text-stone-900">QR Code</div>

      <p className="text-xs text-stone-500">
        QR code will contain each attendee&apos;s unique check-in data.
      </p>

      {/* Foreground Color */}
      <div className="space-y-1">
        <Label className="text-xs">Foreground Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.qrForeground ?? "#000000"}
            onChange={(e) => update({ qrForeground: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={element.qrForeground ?? "#000000"}
            onChange={(e) => update({ qrForeground: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-1">
        <Label className="text-xs">Background Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.qrBackground ?? "#FFFFFF"}
            onChange={(e) => update({ qrBackground: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={element.qrBackground ?? "#FFFFFF"}
            onChange={(e) => update({ qrBackground: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Size (always square) */}
      <div className="space-y-1">
        <Label className="text-xs">Size</Label>
        <Input
          type="number"
          min={20}
          max={300}
          value={Math.round(element.width)}
          onChange={(e) => {
            const size = Math.max(20, Number(e.target.value));
            update({ width: size, height: size });
          }}
          className="h-8 text-xs"
        />
      </div>

      <PositionProperties element={element} />
    </div>
  );
}
