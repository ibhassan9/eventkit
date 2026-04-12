"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@eventkit/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@eventkit/ui/alert-dialog";
import type { BadgeConfigV2 } from "@eventkit/types";
import { EditorProvider, useEditor } from "./state/editor-context";
import { EditorToolbar } from "./toolbar/editor-toolbar";
import { PropertiesPanel } from "./properties/properties-panel";
import { BottomBar } from "./bottom-bar";
import { STARTER_TEMPLATES } from "./templates/starter-templates";
import { useAutoSave } from "./hooks/use-auto-save";
import { loadEditorFonts } from "./utils/font-loader";
import { SAMPLE_ATTENDEE } from "./constants";

// Dynamic import to avoid SSR issues with Konva
const EditorCanvas = dynamic(
  () =>
    import("./canvas/editor-canvas").then((mod) => ({
      default: mod.EditorCanvas,
    })),
  { ssr: false }
);

interface BadgeEditorProps {
  eventId: string;
  templateId?: string;
  initialName: string;
  initialConfig: BadgeConfigV2;
  onSave: (data: {
    eventId: string;
    templateId?: string;
    name: string;
    config: BadgeConfigV2;
  }) => Promise<{ success: boolean; error?: string }>;
  onBack: () => void;
  onDelete?: () => void;
}

export function BadgeEditor({
  eventId,
  templateId,
  initialName,
  initialConfig,
  onSave,
  onBack,
  onDelete,
}: BadgeEditorProps) {
  // Load fonts on mount
  useEffect(() => {
    loadEditorFonts();
  }, []);

  return (
    <EditorProvider initialConfig={initialConfig} initialName={initialName}>
      <EditorInner
        eventId={eventId}
        templateId={templateId}
        onSave={onSave}
        onBack={onBack}
        onDelete={onDelete}
      />
    </EditorProvider>
  );
}

function EditorInner({
  eventId,
  templateId,
  onSave,
  onBack,
  onDelete,
}: Omit<BadgeEditorProps, "initialName" | "initialConfig">) {
  const { state, dispatch } = useEditor();
  const [isSaving, startSaving] = useTransition();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templateConfirm, setTemplateConfirm] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    const result = await onSave({
      eventId,
      templateId,
      name: state.templateName,
      config: state.config,
    });
    if (result.success) {
      dispatch({ type: "MARK_SAVED" });
      toast.success("Badge saved");
    } else {
      toast.error(result.error ?? "Failed to save");
    }
  }, [onSave, eventId, templateId, state.templateName, state.config, dispatch]);

  const handleSaveTransition = useCallback(() => {
    startSaving(() => handleSave());
  }, [handleSave]);

  // Auto-save
  useAutoSave({
    config: state.config,
    name: state.templateName,
    isDirty: state.isDirty,
    onSave: handleSave,
  });

  const handleApplyTemplate = useCallback(
    (templateKey: string) => {
      if (state.config.elements.length > 0) {
        setTemplateConfirm(templateKey);
      } else {
        const template = STARTER_TEMPLATES[templateKey];
        if (template) {
          dispatch({ type: "APPLY_TEMPLATE", config: template });
        }
      }
    },
    [state.config.elements.length, dispatch]
  );

  const confirmApplyTemplate = useCallback(() => {
    if (templateConfirm) {
      const template = STARTER_TEMPLATES[templateConfirm];
      if (template) {
        dispatch({ type: "APPLY_TEMPLATE", config: template });
      }
      setTemplateConfirm(null);
    }
  }, [templateConfirm, dispatch]);

  return (
    <div className="flex h-full flex-col">
      <EditorToolbar
        onBack={onBack}
        onSave={handleSaveTransition}
        onPreview={() => setPreviewOpen(true)}
        onDelete={onDelete}
        isSaving={isSaving}
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        <PropertiesPanel onApplyTemplate={handleApplyTemplate} />
      </div>

      <BottomBar />

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Badge Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center bg-stone-100 rounded-lg p-8">
            <PreviewBadge config={state.config} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Preview with sample attendee data. Merge fields show resolved
            values.
          </p>
        </DialogContent>
      </Dialog>

      {/* Template confirmation dialog */}
      <AlertDialog
        open={!!templateConfirm}
        onOpenChange={(open) => {
          if (!open) setTemplateConfirm(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all existing elements with the template
              layout. This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApplyTemplate}>
              Apply Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** Simple HTML preview of the badge with resolved merge fields */
function PreviewBadge({ config }: { config: BadgeConfigV2 }) {
  const scale = 1.5;
  const canvasW = config.width * 150;
  const canvasH = config.height * 150;

  return (
    <div
      style={{
        width: canvasW * scale,
        height: canvasH * scale,
        backgroundColor: config.backgroundColor,
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {[...config.elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .filter((el) => el.visible !== false)
        .map((el) => {
          const style: React.CSSProperties = {
            position: "absolute",
            left: el.x * scale,
            top: el.y * scale,
            width: el.width * scale,
            height: el.height * scale,
            transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          };

          if (el.type === "text") {
            const text = el.mergeField
              ? (SAMPLE_ATTENDEE[el.mergeField] ?? el.mergeField)
              : (el.text ?? "");
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  fontSize: (el.fontSize ?? 16) * scale,
                  fontWeight: el.fontWeight ?? 400,
                  fontFamily: el.fontFamily ?? "Inter",
                  color: el.fontColor ?? "#000000",
                  textAlign: el.textAlign ?? "left",
                  lineHeight: el.lineHeight ?? 1.2,
                  overflow: "hidden",
                }}
              >
                {text}
              </div>
            );
          }

          if (el.type === "shape") {
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  backgroundColor: el.fill ?? "transparent",
                  border:
                    el.strokeWidth && el.stroke
                      ? `${el.strokeWidth * scale}px solid ${el.stroke}`
                      : undefined,
                  borderRadius:
                    el.shapeType === "circle"
                      ? "50%"
                      : el.cornerRadius
                        ? el.cornerRadius * scale
                        : 0,
                  opacity: el.opacity ?? 1,
                }}
              />
            );
          }

          if (el.type === "line") {
            return (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: el.x * scale,
                  top: el.y * scale,
                  width: el.width * scale,
                  height: 0,
                  borderBottom: `${(el.strokeWidth ?? 1) * scale}px ${
                    el.dashPattern ? "dashed" : "solid"
                  } ${el.stroke ?? "#d6d3d1"}`,
                }}
              />
            );
          }

          if (el.type === "qr") {
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 4,
                }}
              >
                <svg viewBox="0 0 100 100" width="80%" height="80%">
                  <rect x="10" y="10" width="25" height="25" fill={el.qrForeground ?? "#000"} />
                  <rect x="65" y="10" width="25" height="25" fill={el.qrForeground ?? "#000"} />
                  <rect x="10" y="65" width="25" height="25" fill={el.qrForeground ?? "#000"} />
                  <rect x="40" y="40" width="20" height="20" fill={el.qrForeground ?? "#000"} />
                  <rect x="65" y="65" width="10" height="10" fill={el.qrForeground ?? "#000"} />
                  <rect x="80" y="80" width="10" height="10" fill={el.qrForeground ?? "#000"} />
                </svg>
              </div>
            );
          }

          if (el.type === "image" && el.src) {
            return (
              <img
                key={el.id}
                src={el.src}
                alt=""
                style={{
                  ...style,
                  objectFit: "cover",
                  opacity: el.opacity ?? 1,
                  borderRadius: el.cornerRadius
                    ? el.cornerRadius * scale
                    : 0,
                }}
              />
            );
          }

          return null;
        })}
    </div>
  );
}
