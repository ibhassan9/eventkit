"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@eventkit/ui/input";

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function DataTableToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 pl-9"
        />
      </div>
      {filters}
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  );
}
