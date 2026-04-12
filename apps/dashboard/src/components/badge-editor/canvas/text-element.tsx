"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Text } from "react-konva";
import type Konva from "konva";
import type { BadgeElement } from "@eventkit/types";
import { SAMPLE_ATTENDEE } from "../constants";
import { useEditor } from "../state/editor-context";

interface TextElementProps {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
}

function resolveText(element: BadgeElement): string {
  if (element.mergeField) {
    return SAMPLE_ATTENDEE[element.mergeField] ?? element.mergeField;
  }
  return element.text ?? "Text";
}

export function TextElement({
  element,
  onSelect,
}: TextElementProps) {
  const { dispatch } = useEditor();
  const shapeRef = useRef<Konva.Text>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDblClick = useCallback(() => {
    if (element.mergeField || element.locked) return;
    setIsEditing(true);

    const node = shapeRef.current;
    if (!node) return;
    const stage = node.getStage();
    if (!stage) return;

    const stageBox = stage.container().getBoundingClientRect();
    const absPos = node.getAbsolutePosition();
    const scale = node.getAbsoluteScale();

    const textarea = document.createElement("textarea");
    textarea.value = element.text ?? "";
    textarea.style.position = "fixed";
    textarea.style.left = `${stageBox.left + absPos.x}px`;
    textarea.style.top = `${stageBox.top + absPos.y}px`;
    textarea.style.width = `${node.width() * scale.x}px`;
    textarea.style.minHeight = `${node.height() * scale.y}px`;
    textarea.style.fontSize = `${(element.fontSize ?? 16) * scale.x}px`;
    textarea.style.fontFamily = element.fontFamily ?? "Inter";
    textarea.style.fontWeight = String(element.fontWeight ?? 400);
    textarea.style.color = element.fontColor ?? "#000000";
    textarea.style.textAlign = element.textAlign ?? "left";
    textarea.style.border = "2px solid #7c3aed";
    textarea.style.borderRadius = "2px";
    textarea.style.padding = "0";
    textarea.style.margin = "0";
    textarea.style.overflow = "hidden";
    textarea.style.background = "transparent";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = String(element.lineHeight ?? 1.2);
    textarea.style.zIndex = "10000";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const finish = () => {
      const newText = textarea.value;
      document.body.removeChild(textarea);
      setIsEditing(false);
      dispatch({
        type: "UPDATE_ELEMENT",
        id: element.id,
        changes: { text: newText },
      });
    };

    textarea.addEventListener("blur", finish);
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        textarea.removeEventListener("blur", finish);
        document.body.removeChild(textarea);
        setIsEditing(false);
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finish();
      }
    });
  }, [element, dispatch]);

  // Sync font rendering
  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.getLayer()?.batchDraw();
    }
  }, [element.fontFamily, element.fontSize, element.fontWeight]);

  const displayText = resolveText(element);

  return (
    <Text
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      text={displayText}
      fontSize={element.fontSize ?? 16}
      fontFamily={element.fontFamily ?? "Inter"}
      fontStyle={
        element.fontWeight && element.fontWeight >= 600
          ? "bold"
          : "normal"
      }
      fill={element.fontColor ?? "#000000"}
      align={element.textAlign ?? "left"}
      lineHeight={element.lineHeight ?? 1.2}
      letterSpacing={element.letterSpacing ?? 0}
      rotation={element.rotation}
      draggable={!element.locked}
      visible={element.visible !== false && !isEditing}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
    />
  );
}
