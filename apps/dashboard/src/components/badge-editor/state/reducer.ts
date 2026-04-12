import type { BadgeElement } from "@eventkit/types";
import type { EditorState, EditorAction } from "../types";

function reindex(elements: BadgeElement[]): BadgeElement[] {
  return elements.map((el, i) => ({ ...el, zIndex: i }));
}

export function editorReducer(
  state: EditorState,
  action: EditorAction
): EditorState {
  switch (action.type) {
    case "ADD_ELEMENT": {
      const elements = [
        ...state.config.elements,
        { ...action.element, zIndex: state.config.elements.length },
      ];
      return {
        ...state,
        config: { ...state.config, elements },
        selectedIds: [action.element.id],
        isDirty: true,
      };
    }

    case "UPDATE_ELEMENT": {
      const elements = state.config.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.changes } : el
      );
      return {
        ...state,
        config: { ...state.config, elements },
        isDirty: true,
      };
    }

    case "DELETE_ELEMENTS": {
      const ids = new Set(action.ids);
      const elements = reindex(
        state.config.elements.filter((el) => !ids.has(el.id))
      );
      return {
        ...state,
        config: { ...state.config, elements },
        selectedIds: state.selectedIds.filter((id) => !ids.has(id)),
        isDirty: true,
      };
    }

    case "SELECT":
      return { ...state, selectedIds: action.ids };

    case "DESELECT_ALL":
      return { ...state, selectedIds: [] };

    case "TOGGLE_SELECT": {
      const has = state.selectedIds.includes(action.id);
      return {
        ...state,
        selectedIds: has
          ? state.selectedIds.filter((id) => id !== action.id)
          : [...state.selectedIds, action.id],
      };
    }

    case "REORDER": {
      const elements = [...state.config.elements].sort(
        (a, b) => a.zIndex - b.zIndex
      );
      const idx = elements.findIndex((el) => el.id === action.id);
      if (idx === -1) return state;

      switch (action.direction) {
        case "front": {
          const el = elements.splice(idx, 1)[0];
          elements.push(el);
          break;
        }
        case "back": {
          const el = elements.splice(idx, 1)[0];
          elements.unshift(el);
          break;
        }
        case "forward": {
          if (idx < elements.length - 1) {
            [elements[idx], elements[idx + 1]] = [
              elements[idx + 1],
              elements[idx],
            ];
          }
          break;
        }
        case "backward": {
          if (idx > 0) {
            [elements[idx], elements[idx - 1]] = [
              elements[idx - 1],
              elements[idx],
            ];
          }
          break;
        }
      }

      return {
        ...state,
        config: { ...state.config, elements: reindex(elements) },
        isDirty: true,
      };
    }

    case "COPY": {
      const ids = new Set(state.selectedIds);
      const clipboard = state.config.elements.filter((el) => ids.has(el.id));
      return { ...state, clipboard };
    }

    case "PASTE": {
      if (state.clipboard.length === 0) return state;
      const offset = action.offset ?? { x: 20, y: 20 };
      const newElements = state.clipboard.map((el) => ({
        ...el,
        id: crypto.randomUUID(),
        x: el.x + offset.x,
        y: el.y + offset.y,
        zIndex: state.config.elements.length,
      }));
      const elements = [...state.config.elements, ...newElements];
      return {
        ...state,
        config: { ...state.config, elements: reindex(elements) },
        selectedIds: newElements.map((el) => el.id),
        isDirty: true,
      };
    }

    case "DUPLICATE": {
      const ids = new Set(state.selectedIds);
      const toDupe = state.config.elements.filter((el) => ids.has(el.id));
      if (toDupe.length === 0) return state;
      const newElements = toDupe.map((el) => ({
        ...el,
        id: crypto.randomUUID(),
        x: el.x + 10,
        y: el.y + 10,
      }));
      const elements = [...state.config.elements, ...newElements];
      return {
        ...state,
        config: { ...state.config, elements: reindex(elements) },
        selectedIds: newElements.map((el) => el.id),
        isDirty: true,
      };
    }

    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.5, Math.min(1.5, action.zoom)) };

    case "SET_BADGE_SIZE":
      return {
        ...state,
        config: {
          ...state.config,
          width: action.width,
          height: action.height,
        },
        isDirty: true,
      };

    case "SET_BACKGROUND":
      return {
        ...state,
        config: { ...state.config, backgroundColor: action.color },
        isDirty: true,
      };

    case "SET_NAME":
      return { ...state, templateName: action.name };

    case "APPLY_TEMPLATE":
      return {
        ...state,
        config: action.config,
        selectedIds: [],
        isDirty: true,
      };

    case "LOAD_CONFIG":
      return {
        ...state,
        config: action.config,
        selectedIds: [],
        isDirty: false,
      };

    case "MARK_SAVED":
      return { ...state, isDirty: false };

    default:
      return state;
  }
}
