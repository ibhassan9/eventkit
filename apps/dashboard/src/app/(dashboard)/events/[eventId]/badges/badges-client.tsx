"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  ArrowLeft,
  Loader2,
  MoreHorizontal,
  Pencil,
  Download,
  Trash2,
  BadgeCheck,
} from "lucide-react";
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
import { BadgeDesigner } from "@/components/badge-designer/badge-designer";
import { BADGE_PRESETS } from "@/components/badge-designer/preset-configs";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { useDebouncedValue } from "@/hooks/use-debounce";
import type { BadgeConfig } from "@eventkit/types";
import { useBadgeTemplates } from "@/hooks/use-badge-templates";
import {
  saveBadgeTemplate,
  deleteBadgeTemplateAction,
} from "./actions";
import { generateBadgeDesign } from "./generate-action";

interface BadgesClientProps {
  eventId: string;
}

export function BadgesClient({ eventId }: BadgesClientProps) {
  const {
    data: templates,
    isLoading,
    error,
    refetch,
  } = useBadgeTemplates(eventId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const editing = editingId
    ? templates?.find((t) => t.id === editingId)
    : null;

  const filteredTemplates = templates?.filter((t) =>
    t.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) ?? [];

  const handleSave = useCallback(
    async (data: {
      eventId: string;
      templateId?: string;
      name: string;
      config: BadgeConfig;
    }) => {
      const result = await saveBadgeTemplate(data);
      if (result.success && result.data) {
        setEditingId(result.data.id);
        setIsCreating(false);
        refetch();
      }
      return result;
    },
    [refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteBadgeTemplateAction({
        eventId,
        templateId: id,
      });
      if (result.success) {
        toast.success("Badge template deleted");
        refetch();
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    },
    [eventId, refetch]
  );

  const handleGenerateAI = useCallback(
    async (data: { eventId: string }) => {
      return generateBadgeDesign({ eventId: data.eventId });
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-sm text-destructive">
        Failed to load badge templates. Please try again.
      </div>
    );
  }

  if (editing || isCreating) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => {
            setEditingId(null);
            setIsCreating(false);
            refetch();
          }}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to templates
        </Button>
        <BadgeDesigner
          eventId={eventId}
          templateId={editing?.id}
          initialName={editing?.name ?? ""}
          initialConfig={editing?.config ?? BADGE_PRESETS.minimal}
          onSave={handleSave}
          onGenerateAI={handleGenerateAI}
        />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <DataTableEmptyState
        icon={BadgeCheck}
        title="No badge templates"
        description="Design your first badge template for attendee check-in."
        actionLabel="Create Badge Template"
        onAction={() => setIsCreating(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchPlaceholder="Search templates..."
        searchValue={search}
        onSearchChange={setSearch}
        actions={
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Template
          </Button>
        }
      />
      <div className="rounded-xl border bg-card">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-stone-50">
                <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Name</th>
                <th className="h-10 w-[100px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Size</th>
                <th className="h-10 w-[200px] px-3 text-left text-xs font-medium uppercase tracking-wide text-stone-400">Fields</th>
                <th className="h-10 w-[50px] px-3" />
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((t) => {
                const config = t.config as BadgeConfig;
                return (
                  <tr
                    key={t.id}
                    className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer transition-colors text-[13px] text-stone-700"
                    onClick={() => setEditingId(t.id)}
                  >
                    <td className="px-3 py-3">
                      <span className="font-medium text-stone-900">{t.name}</span>
                    </td>
                    <td className="px-3 py-3 text-stone-500">
                      {config.width} x {config.height} mm
                    </td>
                    <td className="px-3 py-3 text-stone-500 truncate">
                      {config.fields?.map(f => f.type).join(", ") || "\u2014"}
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-1 hover:bg-stone-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingId(t.id)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/api/events/${eventId}/badges/pdf?templateId=${t.id}`, "_blank")}>
                            <Download className="mr-2 h-3.5 w-3.5" />Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(t.id)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete badge template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{templates?.find(t => t.id === deleteTarget)?.name}&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteTarget) { handleDelete(deleteTarget); setDeleteTarget(null); } }}
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
