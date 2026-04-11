"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Plus } from "lucide-react";

interface DataTableEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function DataTableEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: DataTableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Icon className="h-12 w-12 text-stone-300" />
      <h3 className="mt-4 text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-stone-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          <Plus className="mr-1.5 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
