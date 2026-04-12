"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import type Konva from "konva";
import type { BadgeConfigV2 } from "@eventkit/types";
import type { EditorState, EditorAction } from "../types";
import { useEditorHistory } from "./use-editor-history";

interface EditorContextValue {
  state: EditorState;
  dispatch: (action: EditorAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  stageRef: React.RefObject<Konva.Stage | null>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

interface EditorProviderProps {
  initialConfig: BadgeConfigV2;
  initialName: string;
  children: ReactNode;
}

export function EditorProvider({
  initialConfig,
  initialName,
  children,
}: EditorProviderProps) {
  const stageRef = useRef<Konva.Stage | null>(null);

  const initialState: EditorState = {
    config: initialConfig,
    selectedIds: [],
    zoom: 1,
    isDirty: false,
    clipboard: [],
    templateName: initialName,
  };

  const { state, dispatch, undo, redo, canUndo, canRedo } =
    useEditorHistory(initialState);

  return (
    <EditorContext.Provider
      value={{ state, dispatch, undo, redo, canUndo, canRedo, stageRef }}
    >
      {children}
    </EditorContext.Provider>
  );
}
