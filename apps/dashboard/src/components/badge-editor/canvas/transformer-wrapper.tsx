"use client";

import { useRef, useEffect } from "react";
import { Transformer } from "react-konva";
import type Konva from "konva";

interface TransformerWrapperProps {
  selectedIds: string[];
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function TransformerWrapper({
  selectedIds,
  stageRef,
}: TransformerWrapperProps) {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const transformer = trRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;

    if (selectedIds.length === 0) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }

    const nodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter((n): n is Konva.Node => !!n);

    transformer.nodes(nodes);
    transformer.getLayer()?.batchDraw();
  }, [selectedIds, stageRef]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={true}
      rotationSnaps={[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345]}
      rotateAnchorOffset={20}
      enabledAnchors={[
        "top-left",
        "top-center",
        "top-right",
        "middle-left",
        "middle-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ]}
      boundBoxFunc={(oldBox, newBox) => {
        if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
          return oldBox;
        }
        return newBox;
      }}
      borderStroke="#7c3aed"
      borderStrokeWidth={1}
      anchorStroke="#7c3aed"
      anchorFill="#ffffff"
      anchorSize={8}
      anchorCornerRadius={2}
    />
  );
}
