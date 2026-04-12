"use client";

import { ScrollArea } from "@eventkit/ui/scroll-area";
import { useEditor } from "../state/editor-context";
import { TextProperties } from "./text-properties";
import { ImageProperties } from "./image-properties";
import { QrProperties } from "./qr-properties";
import { ShapeProperties } from "./shape-properties";
import { LineProperties } from "./line-properties";
import { BadgeProperties } from "./badge-properties";

interface PropertiesPanelProps {
  onApplyTemplate: (templateKey: string) => void;
}

export function PropertiesPanel({ onApplyTemplate }: PropertiesPanelProps) {
  const { state } = useEditor();
  const { selectedIds, config } = state;

  const selectedElement =
    selectedIds.length === 1
      ? config.elements.find((el) => el.id === selectedIds[0])
      : null;

  return (
    <div className="w-[280px] border-l bg-white flex-shrink-0">
      <ScrollArea className="h-full">
        {!selectedElement ? (
          <BadgeProperties onApplyTemplate={onApplyTemplate} />
        ) : selectedElement.type === "text" ? (
          <TextProperties element={selectedElement} />
        ) : selectedElement.type === "image" ? (
          <ImageProperties element={selectedElement} />
        ) : selectedElement.type === "qr" ? (
          <QrProperties element={selectedElement} />
        ) : selectedElement.type === "shape" ? (
          <ShapeProperties element={selectedElement} />
        ) : selectedElement.type === "line" ? (
          <LineProperties element={selectedElement} />
        ) : (
          <BadgeProperties onApplyTemplate={onApplyTemplate} />
        )}
      </ScrollArea>
    </div>
  );
}
