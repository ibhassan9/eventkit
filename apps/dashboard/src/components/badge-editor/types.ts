import type { BadgeConfigV2, BadgeElement } from "@eventkit/types";

export interface EditorState {
  config: BadgeConfigV2;
  selectedIds: string[];
  zoom: number;
  isDirty: boolean;
  clipboard: BadgeElement[];
  templateName: string;
}

export type EditorAction =
  | { type: "ADD_ELEMENT"; element: BadgeElement }
  | { type: "UPDATE_ELEMENT"; id: string; changes: Partial<BadgeElement> }
  | { type: "DELETE_ELEMENTS"; ids: string[] }
  | { type: "SELECT"; ids: string[] }
  | { type: "DESELECT_ALL" }
  | { type: "TOGGLE_SELECT"; id: string }
  | {
      type: "REORDER";
      id: string;
      direction: "front" | "back" | "forward" | "backward";
    }
  | { type: "COPY" }
  | { type: "PASTE"; offset?: { x: number; y: number } }
  | { type: "DUPLICATE" }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_BADGE_SIZE"; width: number; height: number }
  | { type: "SET_BACKGROUND"; color: string }
  | { type: "SET_NAME"; name: string }
  | { type: "APPLY_TEMPLATE"; config: BadgeConfigV2 }
  | { type: "LOAD_CONFIG"; config: BadgeConfigV2 }
  | { type: "MARK_SAVED" };

// Actions that don't modify elements and shouldn't be tracked in undo history
export const NON_UNDOABLE_ACTIONS = new Set<EditorAction["type"]>([
  "SELECT",
  "DESELECT_ALL",
  "TOGGLE_SELECT",
  "SET_ZOOM",
  "MARK_SAVED",
  "SET_NAME",
  "LOAD_CONFIG",
]);
