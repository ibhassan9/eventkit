"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Button } from "@eventkit/ui/button";
import { Separator } from "@eventkit/ui/separator";
import { useEditor } from "../state/editor-context";
import { BADGE_SIZES } from "../constants";
import { STARTER_TEMPLATES } from "../templates/starter-templates";

interface BadgePropertiesProps {
  onApplyTemplate: (templateKey: string) => void;
}

export function BadgeProperties({ onApplyTemplate }: BadgePropertiesProps) {
  const { state, dispatch } = useEditor();
  const { config } = state;

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm font-semibold text-stone-900">
        Badge Settings
      </div>

      {/* Size */}
      <div className="space-y-2">
        <Label className="text-xs">Size</Label>
        <div className="flex flex-wrap gap-1.5">
          {BADGE_SIZES.map((size) => (
            <Button
              key={size.label}
              variant={
                config.width === size.width && config.height === size.height
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="text-xs h-7"
              onClick={() =>
                dispatch({
                  type: "SET_BADGE_SIZE",
                  width: size.width,
                  height: size.height,
                })
              }
            >
              {size.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step={0.5}
            min={1}
            max={10}
            value={config.width}
            onChange={(e) =>
              dispatch({
                type: "SET_BADGE_SIZE",
                width: Number(e.target.value),
                height: config.height,
              })
            }
            className="h-8 text-xs"
          />
          <span className="text-xs text-stone-400">×</span>
          <Input
            type="number"
            step={0.5}
            min={1}
            max={10}
            value={config.height}
            onChange={(e) =>
              dispatch({
                type: "SET_BADGE_SIZE",
                width: config.width,
                height: Number(e.target.value),
              })
            }
            className="h-8 text-xs"
          />
          <span className="text-xs text-stone-400">in</span>
        </div>
      </div>

      {/* Background */}
      <div className="space-y-1">
        <Label className="text-xs">Background</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) =>
              dispatch({ type: "SET_BACKGROUND", color: e.target.value })
            }
            className="h-8 w-8 cursor-pointer rounded border"
          />
          <Input
            value={config.backgroundColor}
            onChange={(e) =>
              dispatch({ type: "SET_BACKGROUND", color: e.target.value })
            }
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      <Separator />

      {/* Templates */}
      <div className="space-y-2">
        <Label className="text-xs">Templates</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(STARTER_TEMPLATES).map(([key]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="h-8 text-xs capitalize"
              onClick={() => onApplyTemplate(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
