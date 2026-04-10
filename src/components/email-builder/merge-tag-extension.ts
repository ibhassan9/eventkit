import { Node, mergeAttributes } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    mergeTag: {
      insertMergeTag: (attributes: { id: string; label: string }) => ReturnType;
    };
  }
}

export const MergeTagNode = Node.create({
  name: "mergeTag",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="merge-tag"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "merge-tag",
        "data-id": HTMLAttributes.id,
        class:
          "inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 select-none",
        contenteditable: "false",
      }),
      `{{${HTMLAttributes.id}}}`,
    ];
  },

  addCommands() {
    return {
      insertMergeTag:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
