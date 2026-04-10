"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorToolbar } from "./editor-toolbar";
import { MergeTagInserter } from "./merge-tag-inserter";
import { MergeTagNode } from "./merge-tag-extension";

interface EmailEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function EmailEditor({ content, onChange, placeholder }: EmailEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing your email...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      UnderlineExtension,
      MergeTagNode,
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border bg-background">
      <div className="flex items-center justify-between border-b pr-2">
        <EditorToolbar editor={editor} />
        <MergeTagInserter editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
