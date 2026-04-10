"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await onDelete(id);
      if (result.success) {
        toast.success("Template deleted");
      } else {
        toast.error(result.error ?? "Failed to delete template");
      }
      setDeletingId(null);
    });
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Mail className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="mb-1 text-lg font-medium">No email templates</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first email template to communicate with attendees.
          </p>
          <Button onClick={onNew}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {templates.length} template{templates.length !== 1 ? "s" : ""}
        </h3>
        <Button size="sm" onClick={onNew}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Template
        </Button>
      </div>
      {templates.map((template) => (
        <Card key={template.id} className="group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {template.subject}
              </p>
            </div>
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {TYPE_LABELS[template.type] ?? template.type}
            </span>
          </CardHeader>
          <CardContent className="flex gap-2 pt-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSelect(template.id)}
            >
              <Pencil className="mr-1.5 h-3 w-3" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button size="sm" variant="ghost" className="text-destructive" />}
              >
                {isPending && deletingId === template.id ? (
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="mr-1.5 h-3 w-3" />
                )}
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete template?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &ldquo;{template.name}&rdquo;.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(template.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
