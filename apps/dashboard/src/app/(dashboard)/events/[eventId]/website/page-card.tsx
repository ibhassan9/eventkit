"use client";

import { useState, useRef, useEffect } from "react";
import { Switch } from "@eventkit/ui/switch";
import { Input } from "@eventkit/ui/input";
import { Button } from "@eventkit/ui/button";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface PageCardProps {
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  icon: LucideIcon;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}

export function PageCard({
  title,
  onTitleChange,
  description,
  icon: Icon,
  visible,
  onVisibleChange,
  actionLabel,
  actionHref,
  onAction,
}: PageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleSave() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title) {
      onTitleChange(trimmed);
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(title);
      setIsEditing(false);
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-7 text-sm font-semibold px-1.5 -ml-1.5"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-stone-900 hover:text-stone-600 transition-colors text-left"
              >
                {title}
              </button>
            )}
            <p className="text-xs text-stone-500 mt-0.5">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onVisibleChange ? (
            <Switch
              checked={visible}
              onCheckedChange={onVisibleChange}
            />
          ) : (
            <span className="text-xs text-stone-400">Always visible</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        {actionHref ? (
          <Link href={actionHref}>
            <Button variant="ghost" size="sm">
              {actionLabel}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" size="sm" onClick={onAction}>
            {actionLabel}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
