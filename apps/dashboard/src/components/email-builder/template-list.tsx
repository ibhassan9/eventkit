"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@eventkit/ui/dropdown-menu";
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
import { Badge } from "@eventkit/ui/badge";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: string;
}

interface TemplateListProps {
  templates: EmailTemplate[];
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  confirmation: "Confirmation",
  reminder: "Reminder",
  update: "Update",
  custom: "Custom",
};

export function TemplateList({
  templates,
  onSelect,
  onNew,
  onDelete,
}: TemplateListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const result = await onDelete(id);
    if (result.success) {
      toast.success("Template deleted");
    } else {
      toast.error(result.error ?? "Failed to delete template");
    }
  }

  if (templates.length === 0) {
    return (
      <DataTableEmptyState
        icon={Mail}
        title="No email templates"
        description="Create your first email template to communicate with attendees."
        actionLabel="New Template"
        onAction={onNew}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {templates.length} template{templates.length !== 1 ? "s" : ""}
        </h3>
        <Button size="sm" onClick={onNew}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Template
        </Button>
      </div>
      <div className="rounded-xl border bg-card">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-stone-50">
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Name
                </th>
                <th className="h-10 w-[250px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">
                  Subject
                </th>
                <th className="h-10 w-[50px] px-3" />
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors text-[13px] text-stone-700"
                  onClick={() => onSelect(template.id)}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">
                        {template.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {TYPE_LABELS[template.type] ?? template.type}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-stone-500 truncate max-w-[250px]">
                    {template.subject}
                  </td>
                  <td
                    className="px-3 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onSelect(template.id)}
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteConfirmId(template.id)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;
              {templates.find((t) => t.id === deleteConfirmId)?.name}
              &rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) handleDelete(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
