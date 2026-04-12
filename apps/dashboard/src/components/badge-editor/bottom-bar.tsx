"use client";

import { Button } from "@eventkit/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEditor } from "./state/editor-context";

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5];

export function BottomBar() {
  const { state, dispatch } = useEditor();
  const { zoom, config, isDirty } = state;

  const zoomIn = () => {
    const nextStep = ZOOM_STEPS.find((s) => s > zoom);
    if (nextStep) dispatch({ type: "SET_ZOOM", zoom: nextStep });
  };

  const zoomOut = () => {
    const prevStep = [...ZOOM_STEPS].reverse().find((s) => s < zoom);
    if (prevStep) dispatch({ type: "SET_ZOOM", zoom: prevStep });
  };

  return (
    <div className="flex items-center justify-between border-t bg-white px-3 py-1.5 text-xs text-stone-500">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={zoomOut}
          disabled={zoom <= ZOOM_STEPS[0]}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-12 text-center font-medium">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={zoomIn}
          disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && (
          <span className="text-amber-600">Unsaved changes</span>
        )}
        <span>
          Badge: {config.width} × {config.height} in
        </span>
      </div>
    </div>
  );
}
