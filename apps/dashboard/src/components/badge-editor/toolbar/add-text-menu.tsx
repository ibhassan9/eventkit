"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@eventkit/ui/dropdown-menu";
import { Type } from "lucide-react";
import type { BadgeElement } from "@eventkit/types";
import { useEditor } from "../state/editor-context";
import { MERGE_FIELDS, PREVIEW_DPI } from "../constants";

function createTextElement(overrides: Partial<BadgeElement>): BadgeElement {
  return {
    id: crypto.randomUUID(),
    type: "text",
    x: 150,
    y: 150,
    width: 300,
    height: 40,
    rotation: 0,
    zIndex: 0,
    locked: false,
    visible: true,
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: 400,
    fontColor: "#1c1917",
    textAlign: "center",
    lineHeight: 1.2,
    ...overrides,
  };
}

export function AddTextMenu() {
  const { state, dispatch } = useEditor();
  const canvasWidth = state.config.width * PREVIEW_DPI;

  const addStatic = () => {
    dispatch({
      type: "ADD_ELEMENT",
      element: createTextElement({
        text: "Your text here",
        x: canvasWidth / 2 - 150,
        y: 200,
      }),
    });
  };

  const addMergeField = (field: (typeof MERGE_FIELDS)[number]) => {
    const fontSize =
      field.value === "{{firstName}}" || field.value === "{{fullName}}"
        ? 36
        : field.value === "{{lastName}}"
          ? 28
          : 18;

    dispatch({
      type: "ADD_ELEMENT",
      element: createTextElement({
        mergeField: field.value,
        fontSize,
        fontWeight:
          field.value === "{{firstName}}" ||
          field.value === "{{fullName}}"
            ? 700
            : 400,
        x: canvasWidth / 2 - 150,
        y: 180,
        fontColor:
          field.value === "{{company}}" || field.value === "{{jobTitle}}"
            ? "#78716c"
            : "#1c1917",
      }),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-md px-3 h-8 text-sm font-medium hover:bg-stone-100 cursor-pointer"
      >
        <Type className="h-4 w-4" />
        Text
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={addStatic}>
          Static Text
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {MERGE_FIELDS.map((field) => (
          <DropdownMenuItem
            key={field.value}
            onClick={() => addMergeField(field)}
          >
            {field.label}
            <span className="ml-auto text-xs text-muted-foreground">
              {field.preview}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
