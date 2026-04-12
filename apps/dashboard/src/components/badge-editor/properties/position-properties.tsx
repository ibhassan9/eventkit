"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Button } from "@eventkit/ui/button";
import { Separator } from "@eventkit/ui/separator";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  ArrowUpToLine,
  ArrowDownToLine,
} from "lucide-react";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";

interface PositionPropertiesProps {
  element: BadgeElement;
}

export function PositionProperties({ element }: PositionPropertiesProps) {
  const { dispatch } = useEditor();

  const update = (changes: Partial<BadgeElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes });
  };

  return (
    <div className="space-y-3">
      <Separator />
      <div className="text-xs font-medium text-stone-400 uppercase tracking-wide">
        Position
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">X</Label>
          <Input
            type="number"
            value={Math.round(element.x)}
            onChange={(e) => update({ x: Number(e.target.value) })}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Y</Label>
          <Input
            type="number"
            value={Math.round(element.y)}
            onChange={(e) => update({ y: Number(e.target.value) })}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">W</Label>
          <Input
            type="number"
            value={Math.round(element.width)}
            onChange={(e) =>
              update({ width: Math.max(20, Number(e.target.value)) })
            }
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">H</Label>
          <Input
            type="number"
            value={Math.round(element.height)}
            onChange={(e) =>
              update({ height: Math.max(20, Number(e.target.value)) })
            }
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Rotation (°)</Label>
        <Input
          type="number"
          value={Math.round(element.rotation)}
          onChange={(e) => update({ rotation: Number(e.target.value) % 360 })}
          className="h-8 text-xs"
        />
      </div>

      <Separator />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() =>
            dispatch({
              type: "REORDER",
              id: element.id,
              direction: "front",
            })
          }
        >
          <ArrowUpToLine className="h-3 w-3" />
          Front
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() =>
            dispatch({
              type: "REORDER",
              id: element.id,
              direction: "back",
            })
          }
        >
          <ArrowDownToLine className="h-3 w-3" />
          Back
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => update({ locked: !element.locked })}
        >
          {element.locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
          {element.locked ? "Unlock" : "Lock"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => update({ visible: element.visible === false })}
        >
          {element.visible === false ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
          {element.visible === false ? "Show" : "Hide"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-destructive"
          onClick={() =>
            dispatch({ type: "DELETE_ELEMENTS", ids: [element.id] })
          }
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
