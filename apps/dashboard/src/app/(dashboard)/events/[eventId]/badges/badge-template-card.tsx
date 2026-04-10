"use client";

import { Download, Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@eventkit/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@eventkit/ui/card";
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
} from "@eventkit/ui/alert-dialog";
import { BadgePreview } from "@/components/badge-designer/badge-preview";
import type { BadgeConfig } from "@eventkit/types";

interface BadgeTemplateCardProps {
  id: string;
  name: string;
  config: BadgeConfig;
  eventId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BadgeTemplateCard({
  id,
  name,
  config,
  eventId,
  onEdit,
  onDelete,
}: BadgeTemplateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="scale-50 origin-top-left">
          <BadgePreview config={config} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(id)}>
            <Pencil className="mr-1.5 h-3 w-3" />
            Edit
          </Button>
          <a
            href={`/api/events/${eventId}/badges/pdf?templateId=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <Download className="mr-1.5 h-3 w-3" />
            PDF
          </a>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="sm" variant="ghost" className="text-destructive" />
              }
            >
              <Trash2 className="mr-1.5 h-3 w-3" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete badge template?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete &ldquo;{name}&rdquo;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
