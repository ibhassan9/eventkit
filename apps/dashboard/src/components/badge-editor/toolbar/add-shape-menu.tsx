"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@eventkit/ui/dropdown-menu";
import { Square } from "lucide-react";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { PREVIEW_DPI } from "../constants";

export function AddShapeMenu() {
  const { state, dispatch } = useEditor();
  const canvasWidth = state.config.width * PREVIEW_DPI;
  const canvasHeight = state.config.height * PREVIEW_DPI;
  const centerX = canvasWidth / 2 - 50;
  const centerY = canvasHeight / 2 - 50;

  const addShape = (shapeType: "rect" | "roundedRect" | "circle") => {
    const element: BadgeElement = {
      id: crypto.randomUUID(),
      type: "shape",
      x: centerX,
      y: centerY,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 0,
      locked: false,
      visible: true,
      shapeType,
      fill: "#e7e5e4",
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: shapeType === "roundedRect" ? 8 : 0,
    };
    dispatch({ type: "ADD_ELEMENT", element });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-md px-3 h-8 text-sm font-medium hover:bg-stone-100 cursor-pointer"
      >
        <Square className="h-4 w-4" />
        Shape
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => addShape("rect")}>
          Rectangle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => addShape("roundedRect")}>
          Rounded Rectangle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => addShape("circle")}>
          Circle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
