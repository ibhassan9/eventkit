"use client";

import { Line } from "react-konva";

export interface GuideLine {
  orientation: "vertical" | "horizontal";
  position: number;
}

interface SnapGuidesProps {
  guides: GuideLine[];
  canvasWidth: number;
  canvasHeight: number;
}

export function SnapGuides({
  guides,
  canvasWidth,
  canvasHeight,
}: SnapGuidesProps) {
  return (
    <>
      {guides.map((guide, i) =>
        guide.orientation === "vertical" ? (
          <Line
            key={`guide-${i}`}
            points={[guide.position, 0, guide.position, canvasHeight]}
            stroke="#e879f9"
            strokeWidth={1}
            dash={[4, 4]}
          />
        ) : (
          <Line
            key={`guide-${i}`}
            points={[0, guide.position, canvasWidth, guide.position]}
            stroke="#e879f9"
            strokeWidth={1}
            dash={[4, 4]}
          />
        )
      )}
    </>
  );
}

const SNAP_THRESHOLD = 5;

interface SnapResult {
  x: number;
  y: number;
  guides: GuideLine[];
}

export function calculateSnap(
  node: { x: number; y: number; width: number; height: number },
  others: { x: number; y: number; width: number; height: number }[],
  canvasWidth: number,
  canvasHeight: number
): SnapResult {
  const guides: GuideLine[] = [];
  let x = node.x;
  let y = node.y;

  const nodeCenterX = node.x + node.width / 2;
  const nodeCenterY = node.y + node.height / 2;
  const nodeRight = node.x + node.width;
  const nodeBottom = node.y + node.height;

  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  // Snap to canvas center
  if (Math.abs(nodeCenterX - canvasCenterX) < SNAP_THRESHOLD) {
    x = canvasCenterX - node.width / 2;
    guides.push({ orientation: "vertical", position: canvasCenterX });
  }
  if (Math.abs(nodeCenterY - canvasCenterY) < SNAP_THRESHOLD) {
    y = canvasCenterY - node.height / 2;
    guides.push({ orientation: "horizontal", position: canvasCenterY });
  }

  // Snap to canvas edges
  if (Math.abs(node.x) < SNAP_THRESHOLD) {
    x = 0;
    guides.push({ orientation: "vertical", position: 0 });
  }
  if (Math.abs(nodeRight - canvasWidth) < SNAP_THRESHOLD) {
    x = canvasWidth - node.width;
    guides.push({ orientation: "vertical", position: canvasWidth });
  }
  if (Math.abs(node.y) < SNAP_THRESHOLD) {
    y = 0;
    guides.push({ orientation: "horizontal", position: 0 });
  }
  if (Math.abs(nodeBottom - canvasHeight) < SNAP_THRESHOLD) {
    y = canvasHeight - node.height;
    guides.push({ orientation: "horizontal", position: canvasHeight });
  }

  // Snap to other elements
  for (const other of others) {
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;
    const otherRight = other.x + other.width;
    const otherBottom = other.y + other.height;

    // Vertical alignment
    if (Math.abs(nodeCenterX - otherCenterX) < SNAP_THRESHOLD) {
      x = otherCenterX - node.width / 2;
      guides.push({ orientation: "vertical", position: otherCenterX });
    }
    if (Math.abs(node.x - other.x) < SNAP_THRESHOLD) {
      x = other.x;
      guides.push({ orientation: "vertical", position: other.x });
    }
    if (Math.abs(nodeRight - otherRight) < SNAP_THRESHOLD) {
      x = otherRight - node.width;
      guides.push({ orientation: "vertical", position: otherRight });
    }

    // Horizontal alignment
    if (Math.abs(nodeCenterY - otherCenterY) < SNAP_THRESHOLD) {
      y = otherCenterY - node.height / 2;
      guides.push({ orientation: "horizontal", position: otherCenterY });
    }
    if (Math.abs(node.y - other.y) < SNAP_THRESHOLD) {
      y = other.y;
      guides.push({ orientation: "horizontal", position: other.y });
    }
    if (Math.abs(nodeBottom - otherBottom) < SNAP_THRESHOLD) {
      y = otherBottom - node.height;
      guides.push({ orientation: "horizontal", position: otherBottom });
    }
  }

  return { x, y, guides };
}
