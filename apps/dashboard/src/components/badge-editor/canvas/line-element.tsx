"use client";

import { useRef, useCallback } from "react";
import { Line } from "react-konva";
import type Konva from "konva";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";

interface LineElementProps {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
}

export function LineElement({
  element,
  onSelect,
}: LineElementProps) {
  const { dispatch } = useEditor();
  const shapeRef = useRef<Konva.Line>(null);

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      dispatch({
        type: "UPDATE_ELEMENT",
        id: element.id,
        changes: {
          x: Math.round(e.target.x()),
          y: Math.round(e.target.y()),
        },
      });
    },
    [dispatch, element.id]
  );

  // Lines are defined as a horizontal line from (0,0) to (width, 0)
  // Position is controlled by x, y on the node
  const points = [0, 0, element.width, 0];

  return (
    <Line
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      points={points}
      stroke={element.stroke ?? "#a8a29e"}
      strokeWidth={element.strokeWidth ?? 1}
      dash={element.dashPattern}
      rotation={element.rotation}
      draggable={!element.locked}
      visible={element.visible !== false}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      // Lines use a hit area for easier selection
      hitStrokeWidth={10}
    />
  );
}
