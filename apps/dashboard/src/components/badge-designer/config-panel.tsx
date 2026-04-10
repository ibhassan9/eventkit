"use client";

import { Plus, Save, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@eventkit/ui/button";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import { Switch } from "@eventkit/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@eventkit/ui/select";
import type { BadgeConfig, BadgeField } from "@eventkit/types";
import { BADGE_PRESETS, PRESET_NAMES } from "./preset-configs";
import { FieldEditor } from "./field-editor";

interface ConfigPanelProps {
  name: string;
  onNameChange: (name: string) => void;
  config: BadgeConfig;
  onConfigChange: (config: BadgeConfig) => void;
  onSave: () => void;
  onGenerate: () => void;
  isSaving: boolean;
  isGenerating: boolean;
}

function ColorInput({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type="color" className="h-9 cursor-pointer p-1" value={value}
        onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function ConfigPanel({
  name, onNameChange, config, onConfigChange, onSave, onGenerate, isSaving, isGenerating,
}: ConfigPanelProps) {
  const set = (partial: Partial<BadgeConfig>) => onConfigChange({ ...config, ...partial });

  function addField() {
    const newField: BadgeField = {
      id: `f${Date.now()}`, type: "custom", label: "Custom",
      fontSize: 12, fontWeight: "normal", x: 144, y: 140, textAlign: "center",
    };
    set({ fields: [...config.fields, newField] });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Template Name</Label>
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Conference Badge" />
      </div>

      <div className="space-y-2">
        <Label>Preset</Label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(BADGE_PRESETS) as BadgeConfig["preset"][]).map((p) => (
            <Button key={p} variant={config.preset === p ? "default" : "outline"} size="sm"
              onClick={() => onConfigChange({ ...BADGE_PRESETS[p] })}>
              {PRESET_NAMES[p]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ColorInput label="Background" value={config.backgroundColor}
          onChange={(v) => set({ backgroundColor: v })} />
        <ColorInput label="Text Color" value={config.textColor}
          onChange={(v) => set({ textColor: v })} />
        <ColorInput label="Accent" value={config.accentColor}
          onChange={(v) => set({ accentColor: v })} />
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <div className="flex items-center gap-3">
          <Switch checked={config.showQrCode} onCheckedChange={(c) => set({ showQrCode: c })} />
          <Label>Show QR Code</Label>
        </div>
        {config.showQrCode && (
          <Select value={config.qrCodePosition}
            onValueChange={(v) => set({ qrCodePosition: v as BadgeConfig["qrCodePosition"] })}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-center">Bottom Center</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Fields</Label>
          <Button variant="outline" size="sm" onClick={addField}>
            <Plus className="mr-1 h-3.5 w-3.5" />Add Field
          </Button>
        </div>
        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {config.fields.map((field, i) => (
            <FieldEditor key={field.id} field={field}
              onChange={(u) => set({ fields: config.fields.map((f, j) => j === i ? u : f) })}
              onRemove={() => set({ fields: config.fields.filter((_, j) => j !== i) })} />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          Save Template
        </Button>
        <Button variant="outline" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
          Design with AI
        </Button>
      </div>
    </div>
  );
}
