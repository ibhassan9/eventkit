import { useReducer, useCallback, useRef } from "react";
import type { BadgeConfigV2 } from "@eventkit/types";
import type { EditorState, EditorAction } from "../types";
import { NON_UNDOABLE_ACTIONS } from "../types";
import { editorReducer } from "./reducer";

const MAX_HISTORY = 50;

interface HistoryState {
  past: BadgeConfigV2[];
  future: BadgeConfigV2[];
}

export function useEditorHistory(initialState: EditorState) {
  const historyRef = useRef<HistoryState>({ past: [], future: [] });

  const [state, rawDispatch] = useReducer(editorReducer, initialState);

  const dispatch = useCallback(
    (action: EditorAction) => {
      // For undoable actions, push current config onto history
      if (!NON_UNDOABLE_ACTIONS.has(action.type)) {
        const h = historyRef.current;
        h.past = [...h.past.slice(-(MAX_HISTORY - 1)), state.config];
        h.future = [];
      }
      rawDispatch(action);
    },
    [state.config]
  );

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h.past.length === 0) return;
    const prev = h.past[h.past.length - 1];
    h.past = h.past.slice(0, -1);
    h.future = [...h.future, state.config];
    rawDispatch({ type: "LOAD_CONFIG", config: prev });
    // Mark dirty since we've changed from saved state
    rawDispatch({ type: "LOAD_CONFIG", config: prev });
  }, [state.config]);

  const redo = useCallback(() => {
    const h = historyRef.current;
    if (h.future.length === 0) return;
    const next = h.future[h.future.length - 1];
    h.future = h.future.slice(0, -1);
    h.past = [...h.past, state.config];
    rawDispatch({ type: "LOAD_CONFIG", config: next });
  }, [state.config]);

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  return { state, dispatch, undo, redo, canUndo, canRedo };
}
