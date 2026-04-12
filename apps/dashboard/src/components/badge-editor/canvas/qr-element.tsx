"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { generateQRDataUrl } from "../utils/qr-renderer";

interface QrElementProps {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
}

export function QrElement({ element, onSelect }: QrElementProps) {
  const { dispatch } = useEditor();
  const shapeRef = useRef<Konva.Image>(null);
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    generateQRDataUrl(
      "https://eventkit.app/checkin/sample-attendee",
      element.qrForeground,
      element.qrBackground
    ).then(setQrUrl);
  }, [element.qrForeground, element.qrBackground]);

  const [img] = useImage(qrUrl);

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
    node.scaleX(1);
    node.scaleY(1);
    // QR is always square — use scaleX for both dimensions
    const newSize = Math.round(Math.max(20, node.width() * scaleX));
    dispatch({
      type: "UPDATE_ELEMENT",
      id: element.id,
      changes: {
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        width: newSize,
        height: newSize,
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
      draggable={!element.locked}
      visible={element.visible !== false}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
}
