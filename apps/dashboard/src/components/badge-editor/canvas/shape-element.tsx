"use client";

import { useRef, useCallback } from "react";
import { Rect, Circle } from "react-konva";
import type Konva from "konva";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";

interface ShapeElementProps {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
}

export function ShapeElement({
  element,
  onSelect,
}: ShapeElementProps) {
  const { dispatch } = useEditor();
  const shapeRef = useRef<Konva.Rect | Konva.Circle>(null);

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

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    dispatch({
      type: "UPDATE_ELEMENT",
      id: element.id,
      changes: {
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        width: Math.round(Math.max(20, node.width() * scaleX)),
        height: Math.round(Math.max(20, node.height() * scaleY)),
        rotation: Math.round(node.rotation()),
      },
    });
  }, [dispatch, element.id]);

  const sharedProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    fill: element.fill ?? "transparent",
    stroke: element.stroke ?? "transparent",
    strokeWidth: element.strokeWidth ?? 0,
    opacity: element.opacity ?? 1,
    draggable: !element.locked,
    visible: element.visible !== false,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  if (element.shapeType === "circle") {
    const radius = Math.min(element.width, element.height) / 2;
    return (
      <Circle
        ref={shapeRef as React.RefObject<Konva.Circle>}
        {...sharedProps}
        // Circle x/y is center, but we store top-left. Offset to match.
        x={element.x + radius}
        y={element.y + radius}
        radius={radius}
      />
    );
  }

  return (
    <Rect
      ref={shapeRef as React.RefObject<Konva.Rect>}
      {...sharedProps}
      width={element.width}
      height={element.height}
      cornerRadius={element.cornerRadius ?? 0}
      dash={element.dashPattern}
    />
  );
}
