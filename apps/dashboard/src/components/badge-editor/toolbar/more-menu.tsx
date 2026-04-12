"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@eventkit/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@eventkit/ui/dialog";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import {
  MoreHorizontal,
  Ruler,
  Palette,
  ImageDown,
  Trash2,
} from "lucide-react";
import { useEditor } from "../state/editor-context";
import { BADGE_SIZES } from "../constants";
import { exportStageToPng } from "../utils/export-utils";

interface MoreMenuProps {
  onDelete?: () => void;
}

export function MoreMenu({ onDelete }: MoreMenuProps) {
  const { state, dispatch, stageRef } = useEditor();
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [sizeWidth, setSizeWidth] = useState(state.config.width);
  const [sizeHeight, setSizeHeight] = useState(state.config.height);

  const handleSizeApply = () => {
    dispatch({
      type: "SET_BADGE_SIZE",
      width: sizeWidth,
      height: sizeHeight,
    });
    setSizeDialogOpen(false);
  };

  const handleExportPng = () => {
    if (stageRef.current) {
      exportStageToPng(stageRef.current);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-stone-100 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setSizeWidth(state.config.width);
              setSizeHeight(state.config.height);
              setSizeDialogOpen(true);
            }}
          >
            <Ruler className="mr-2 h-3.5 w-3.5" />
            Badge Size
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const input = document.createElement("input");
              input.type = "color";
              input.value = state.config.backgroundColor;
              input.addEventListener("input", (e) => {
                dispatch({
                  type: "SET_BACKGROUND",
                  color: (e.target as HTMLInputElement).value,
                });
              });
              input.click();
            }}
          >
            <Palette className="mr-2 h-3.5 w-3.5" />
            Background Color
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPng}>
            <ImageDown className="mr-2 h-3.5 w-3.5" />
            Export as PNG
          </DropdownMenuItem>
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Template
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Badge Size</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {BADGE_SIZES.map((size) => (
                <Button
                  key={size.label}
                  variant={
                    sizeWidth === size.width && sizeHeight === size.height
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setSizeWidth(size.width);
                    setSizeHeight(size.height);
                  }}
                >
                  {size.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1.5">
                <Label>Width (in)</Label>
                <Input
                  type="number"
                  step={0.5}
                  min={1}
                  max={10}
                  value={sizeWidth}
                  onChange={(e) => setSizeWidth(Number(e.target.value))}
                />
              </div>
              <span className="mt-6 text-muted-foreground">×</span>
              <div className="space-y-1.5">
                <Label>Height (in)</Label>
                <Input
                  type="number"
                  step={0.5}
                  min={1}
                  max={10}
                  value={sizeHeight}
                  onChange={(e) => setSizeHeight(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSizeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSizeApply}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
