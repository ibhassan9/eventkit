"use client";

import { type Editor } from "@tiptap/react";
import { Tags } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@eventkit/ui/dropdown-menu";
import { MERGE_TAGS } from "@eventkit/lib/email/merge-tags";

interface MergeTagInserterProps {
  editor: Editor;
}

export function MergeTagInserter({ editor }: MergeTagInserterProps) {
  function handleInsert(key: string, label: string) {
    editor.chain().focus().insertMergeTag({ id: key, label }).run();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="gap-1.5" />}
      >
        <Tags className="h-4 w-4" />
        Merge Tags
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {MERGE_TAGS.map((tag) => (
          <DropdownMenuItem
            key={tag.key}
            onSelect={() => handleInsert(tag.key, tag.label)}
          >
            <span className="font-mono text-xs text-muted-foreground">
              {`{{${tag.key}}}`}
            </span>
            <span className="ml-2">{tag.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
