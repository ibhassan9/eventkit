"use client";

import { useRef, useCallback } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";

interface ImageElementProps {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
}

export function ImageElement({
  element,
  onSelect,
}: ImageElementProps) {
  const { dispatch } = useEditor();
  const shapeRef = useRef<Konva.Image>(null);
  const [img] = useImage(element.src ?? "", "anonymous");

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

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      ref={shapeRef}
      id={element.id}
      image={img}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={element.opacity ?? 1}
      cornerRadius={element.cornerRadius ?? 0}
      draggable={!element.locked}
      visible={element.visible !== false}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
}
