"use client";

import { useCallback } from "react";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Separator } from "@eventkit/ui/separator";
import {
  ArrowLeft,
  ImagePlus,
  QrCode,
  Minus as LineIcon,
  Undo2,
  Redo2,
  Save,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { PREVIEW_DPI } from "../constants";
import { AddTextMenu } from "./add-text-menu";
import { AddShapeMenu } from "./add-shape-menu";
import { MoreMenu } from "./more-menu";

interface EditorToolbarProps {
  onBack: () => void;
  onSave: () => void;
  onPreview: () => void;
  onDelete?: () => void;
  isSaving: boolean;
}

export function EditorToolbar({
  onBack,
  onSave,
  onPreview,
  onDelete,
  isSaving,
}: EditorToolbarProps) {
  const { state, dispatch, undo, redo, canUndo, canRedo } = useEditor();
  const canvasWidth = state.config.width * PREVIEW_DPI;
  const canvasHeight = state.config.height * PREVIEW_DPI;

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        const maxSize = Math.min(canvasWidth * 0.5, canvasHeight * 0.5);
        if (w > maxSize || h > maxSize) {
          const ratio = Math.min(maxSize / w, maxSize / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const element: BadgeElement = {
          id: crypto.randomUUID(),
          type: "image",
          x: canvasWidth / 2 - w / 2,
          y: canvasHeight / 2 - h / 2,
          width: w,
          height: h,
          rotation: 0,
          zIndex: 0,
          locked: false,
          visible: true,
          src: url,
          opacity: 1,
        };
        dispatch({ type: "ADD_ELEMENT", element });
        toast.success("Image added to badge");
      };
      img.src = url;
    };
    input.click();
  }, [dispatch, canvasWidth, canvasHeight]);

  const addQrCode = useCallback(() => {
    const hasQr = state.config.elements.some((el) => el.type === "qr");
    if (hasQr) {
      toast.error(
        "QR code already added. You can move or resize the existing one."
      );
      return;
    }

    const size = 80;
    const element: BadgeElement = {
      id: crypto.randomUUID(),
      type: "qr",
      x: canvasWidth - size - 20,
      y: canvasHeight - size - 20,
      width: size,
      height: size,
      rotation: 0,
      zIndex: 0,
      locked: false,
      visible: true,
      qrForeground: "#000000",
      qrBackground: "#FFFFFF",
    };
    dispatch({ type: "ADD_ELEMENT", element });
  }, [dispatch, state.config.elements, canvasWidth, canvasHeight]);

  const addLine = useCallback(() => {
    const lineWidth = canvasWidth * 0.8;
    const element: BadgeElement = {
      id: crypto.randomUUID(),
      type: "line",
      x: canvasWidth * 0.1,
      y: canvasHeight / 2,
      width: lineWidth,
      height: 1,
      rotation: 0,
      zIndex: 0,
      locked: false,
      visible: true,
      stroke: "#d6d3d1",
      strokeWidth: 1,
    };
    dispatch({ type: "ADD_ELEMENT", element });
  }, [dispatch, canvasWidth, canvasHeight]);

  return (
    <div className="flex items-center gap-1 border-b bg-white px-2 py-1.5">
      {/* Left section: back + add elements */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onBack}
        title="Back to templates"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <AddTextMenu />

      <Button variant="ghost" size="sm" className="gap-1.5" onClick={addImage} title="Add image">
        <ImagePlus className="h-4 w-4" />
        Image
      </Button>

      <Button variant="ghost" size="sm" className="gap-1.5" onClick={addQrCode} title="Add QR code">
        <QrCode className="h-4 w-4" />
        QR
      </Button>

      <AddShapeMenu />

      <Button variant="ghost" size="sm" className="gap-1.5" onClick={addLine} title="Add divider line">
        <LineIcon className="h-4 w-4" />
        Line
      </Button>

      {/* Center section: template name */}
      <div className="flex-1 flex justify-center">
        <Input
          value={state.templateName}
          onChange={(e) =>
            dispatch({ type: "SET_NAME", name: e.target.value })
          }
          className="h-8 w-64 text-center text-sm border-transparent hover:border-stone-200 focus:border-stone-300"
          placeholder="Template name"
        />
      </div>

      {/* Right section: undo/redo, save, preview, more */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onPreview}
          title="Preview with sample data"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <MoreMenu onDelete={onDelete} />
      </div>
    </div>
  );
}
