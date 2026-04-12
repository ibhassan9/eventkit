"use client";

import type { BadgeElement } from "@eventkit/types";
import { TextElement } from "./text-element";
import { ImageElement } from "./image-element";
import { QrElement } from "./qr-element";
import { ShapeElement } from "./shape-element";
import { LineElement } from "./line-element";

interface CanvasElementProps {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
}

export function CanvasElement({
  element,
  isSelected,
  onSelect,
}: CanvasElementProps) {
  switch (element.type) {
    case "text":
      return (
        <TextElement
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
    case "image":
      return (
        <ImageElement
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
    case "qr":
      return (
        <QrElement
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
    case "shape":
      return (
        <ShapeElement
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
    case "line":
      return (
        <LineElement
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      );
    default:
      return null;
  }
}
