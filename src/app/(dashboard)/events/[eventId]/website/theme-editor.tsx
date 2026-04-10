"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { WebsiteConfig } from "@/types";

interface ThemeEditorProps {
  theme: WebsiteConfig["theme"];
  onChange: (theme: WebsiteConfig["theme"]) => void;
}

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="primaryColor"
              value={theme.primaryColor}
              onChange={(e) =>
                onChange({ ...theme, primaryColor: e.target.value })
              }
              className="h-8 w-10 cursor-pointer rounded border border-input"
            />
            <Input
              value={theme.primaryColor}
              onChange={(e) =>
                onChange({ ...theme, primaryColor: e.target.value })
              }
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="secondaryColor"
              value={theme.secondaryColor}
              onChange={(e) =>
                onChange({ ...theme, secondaryColor: e.target.value })
              }
              className="h-8 w-10 cursor-pointer rounded border border-input"
            />
            <Input
              value={theme.secondaryColor}
              onChange={(e) =>
                onChange({ ...theme, secondaryColor: e.target.value })
              }
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="backgroundColor"
              value={theme.backgroundColor}
              onChange={(e) =>
                onChange({ ...theme, backgroundColor: e.target.value })
              }
              className="h-8 w-10 cursor-pointer rounded border border-input"
            />
            <Input
              value={theme.backgroundColor}
              onChange={(e) =>
                onChange({ ...theme, backgroundColor: e.target.value })
              }
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Font</Label>
          <Select
            value={theme.fontFamily}
            onValueChange={(val) => {
              if (val !== null) {
                onChange({
                  ...theme,
                  fontFamily: val as "inter" | "system",
                });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
