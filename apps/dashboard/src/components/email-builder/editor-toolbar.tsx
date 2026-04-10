"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Link, ImageIcon, Minus,
  AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Separator } from "@eventkit/ui/separator";
import { cn } from "@eventkit/lib/utils";

interface EditorToolbarProps {
  editor: Editor;
}

function Btn({ active, onClick, children, title }: {
  active?: boolean; onClick: () => void; children: React.ReactNode; title: string;
}) {
  return (
    <Button type="button" variant="ghost" size="sm" title={title}
      className={cn("h-8 w-8 p-0", active && "bg-accent text-accent-foreground")}
      onClick={onClick}>
      {children}
    </Button>
  );
}

function Sep() {
  return <Separator orientation="vertical" className="mx-1 h-6" />;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const c = editor.chain().focus.bind(editor.chain());

  function insertLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertImage() {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
      <Btn active={editor.isActive("bold")} onClick={() => c().toggleBold().run()} title="Bold">
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()} title="Italic">
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()} title="Underline">
        <Underline className="h-4 w-4" />
      </Btn>
      <Sep />
      <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => c().toggleHeading({ level: 1 }).run()} title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()} title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()} title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </Btn>
      <Sep />
      <Btn active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()} title="Bullet list">
        <List className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()} title="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Sep />
      <Btn active={editor.isActive("link")} onClick={insertLink} title="Link">
        <Link className="h-4 w-4" />
      </Btn>
      <Btn onClick={insertImage} title="Image">
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => c().setHorizontalRule().run()} title="Horizontal rule">
        <Minus className="h-4 w-4" />
      </Btn>
      <Sep />
      <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => c().setTextAlign("left").run()} title="Align left">
        <AlignLeft className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => c().setTextAlign("center").run()} title="Align center">
        <AlignCenter className="h-4 w-4" />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => c().setTextAlign("right").run()} title="Align right">
        <AlignRight className="h-4 w-4" />
      </Btn>
    </div>
  );
}
