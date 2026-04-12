"use client";

import { useCallback, useState, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import type Konva from "konva";
import { useEditor } from "../state/editor-context";
import { PREVIEW_DPI } from "../constants";
import { CanvasElement } from "./canvas-element";
import { TransformerWrapper } from "./transformer-wrapper";
import { SnapGuides, calculateSnap, type GuideLine } from "./snap-guides";

export function EditorCanvas() {
  const { state, dispatch, undo, redo, stageRef } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<GuideLine[]>([]);

  const { config, selectedIds, zoom } = state;
  const canvasWidth = config.width * PREVIEW_DPI;
  const canvasHeight = config.height * PREVIEW_DPI;

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Clicked on empty space
      if (e.target === e.target.getStage()) {
        dispatch({ type: "DESELECT_ALL" });
        return;
      }
      // Check if clicked on background rect
      if (e.target.attrs.id === "badge-background") {
        dispatch({ type: "DESELECT_ALL" });
        return;
      }
    },
    [dispatch]
  );

  const handleElementSelect = useCallback(
    (id: string, e?: MouseEvent) => {
      if (e?.shiftKey) {
        dispatch({ type: "TOGGLE_SELECT", id });
      } else {
        dispatch({ type: "SELECT", ids: [id] });
      }
    },
    [dispatch]
  );

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const draggedId = node.attrs.id;
      if (!draggedId) return;

      const others = config.elements
        .filter((el) => el.id !== draggedId)
        .map((el) => ({
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
        }));

      const snap = calculateSnap(
        {
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
        },
        others,
        canvasWidth,
        canvasHeight
      );

      node.x(snap.x);
      node.y(snap.y);
      setGuides(snap.guides);
    },
    [config.elements, canvasWidth, canvasHeight]
  );

  const handleDragEnd = useCallback(() => {
    setGuides([]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;

      // Delete selected elements
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        e.preventDefault();
        dispatch({ type: "DELETE_ELEMENTS", ids: selectedIds });
        return;
      }

      // Undo
      if (isMeta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo
      if (isMeta && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }

      // Copy
      if (isMeta && e.key === "c") {
        e.preventDefault();
        dispatch({ type: "COPY" });
        return;
      }

      // Paste
      if (isMeta && e.key === "v") {
        e.preventDefault();
        dispatch({ type: "PASTE" });
        return;
      }

      // Duplicate
      if (isMeta && e.key === "d") {
        e.preventDefault();
        dispatch({ type: "DUPLICATE" });
        return;
      }

      // Arrow key nudge
      if (selectedIds.length > 0) {
        const nudge = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowLeft") dx = -nudge;
        if (e.key === "ArrowRight") dx = nudge;
        if (e.key === "ArrowUp") dy = -nudge;
        if (e.key === "ArrowDown") dy = nudge;

        if (dx !== 0 || dy !== 0) {
          e.preventDefault();
          for (const id of selectedIds) {
            const el = config.elements.find((el) => el.id === id);
            if (el && !el.locked) {
              dispatch({
                type: "UPDATE_ELEMENT",
                id,
                changes: { x: el.x + dx, y: el.y + dy },
              });
            }
          }
          return;
        }
      }

      // Layer ordering
      if (selectedIds.length === 1) {
        if (e.key === "]") {
          e.preventDefault();
          dispatch({
            type: "REORDER",
            id: selectedIds[0],
            direction: e.shiftKey ? "front" : "forward",
          });
          return;
        }
        if (e.key === "[") {
          e.preventDefault();
          dispatch({
            type: "REORDER",
            id: selectedIds[0],
            direction: e.shiftKey ? "back" : "backward",
          });
          return;
        }
      }
    },
    [selectedIds, dispatch, undo, redo, config.elements]
  );

  const sortedElements = [...config.elements].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-1 items-center justify-center bg-stone-100 overflow-auto outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))",
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth * zoom}
          height={canvasHeight * zoom}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
        >
          {/* Background layer */}
          <Layer>
            <Rect
              id="badge-background"
              width={canvasWidth}
              height={canvasHeight}
              fill={config.backgroundColor}
              cornerRadius={4}
            />
          </Layer>

          {/* Elements layer */}
          <Layer
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {sortedElements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedIds.includes(element.id)}
                onSelect={() =>
                  handleElementSelect(element.id)
                }
              />
            ))}
            <TransformerWrapper
              selectedIds={selectedIds}
              stageRef={stageRef}
            />
          </Layer>

          {/* Snap guides layer */}
          <Layer listening={false}>
            <SnapGuides
              guides={guides}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
