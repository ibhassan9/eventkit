"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@eventkit/ui/input";
import { Textarea } from "@eventkit/ui/textarea";
import { Label } from "@eventkit/ui/label";
import { Switch } from "@eventkit/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@eventkit/ui/select";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import type { WebsitePages } from "@eventkit/types";
import { useSaveWebsitePages } from "@/hooks/use-website-pages";

const UploadButton = generateUploadButton<OurFileRouter>();

interface SettingsTabProps {
  eventId: string;
  websitePages: WebsitePages;
  onWebsitePagesChange: (pages: WebsitePages) => void;
}

export function SettingsTab({
  eventId,
  websitePages,
  onWebsitePagesChange,
}: SettingsTabProps) {
  const [settings, setSettings] = useState(websitePages.settings);
  const [saved, setSaved] = useState(false);
  const saveMutation = useSaveWebsitePages();
  const isInitialMount = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(
    (updatedSettings: typeof settings) => {
      const updated: WebsitePages = {
        ...websitePages,
        settings: updatedSettings,
      };
      onWebsitePagesChange(updated);
      saveMutation.mutate(
        { eventId, websitePages: updated },
        {
          onSuccess: (result) => {
            if (result.success) {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }
          },
          onError: () => {
            toast.error("Failed to save settings");
          },
        }
      );
    },
    [eventId, websitePages, onWebsitePagesChange, saveMutation]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      doSave(settings);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateTheme(key: keyof typeof settings.theme, value: string) {
    setSettings((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }));
  }

  function updateMeta(key: keyof typeof settings.meta, value: string) {
    setSettings((prev) => ({
      ...prev,
      meta: { ...prev.meta, [key]: value },
    }));
  }

  function updateRegistration(
    key: keyof typeof settings.registration,
    value: string
  ) {
    setSettings((prev) => ({
      ...prev,
      registration: { ...prev.registration, [key]: value },
    }));
  }

  function updateNavbar(
    key: keyof typeof settings.navbar,
    value: string | boolean
  ) {
    setSettings((prev) => ({
      ...prev,
      navbar: { ...prev.navbar, [key]: value },
    }));
  }

  function updateFooter(
    key: keyof typeof settings.footer,
    value: string | boolean
  ) {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, [key]: value },
    }));
  }

  return (
    <div className="space-y-8">
      {/* Saved indicator */}
      <div
        className={`fixed bottom-6 right-6 z-50 rounded-lg bg-stone-900 px-3 py-2 text-xs text-white shadow-lg transition-all duration-300 ${
          saved
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        Saved
      </div>

      {/* Theme */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">Theme</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => updateTheme("primaryColor", e.target.value)}
                className="h-9 w-9 shrink-0 cursor-pointer rounded border border-stone-200 p-0.5"
              />
              <Input
                value={settings.theme.primaryColor}
                onChange={(e) => updateTheme("primaryColor", e.target.value)}
                placeholder="#7C3AED"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => updateTheme("accentColor", e.target.value)}
                className="h-9 w-9 shrink-0 cursor-pointer rounded border border-stone-200 p-0.5"
              />
              <Input
                value={settings.theme.accentColor}
                onChange={(e) => updateTheme("accentColor", e.target.value)}
                placeholder="#F59E0B"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Font</Label>
          <Select
            value={settings.theme.fontFamily}
            onValueChange={(v) => {
              if (v) updateTheme("fontFamily", v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="plus-jakarta-sans">
                Plus Jakarta Sans
              </SelectItem>
              <SelectItem value="dm-sans">DM Sans</SelectItem>
              <SelectItem value="source-sans-3">Source Sans 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* SEO & Meta */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">SEO & Meta</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input
              value={settings.meta.title}
              onChange={(e) => updateMeta("title", e.target.value)}
              placeholder="My Event - Conference 2026"
            />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              value={settings.meta.description}
              onChange={(e) => updateMeta("description", e.target.value)}
              placeholder="A brief description of your event for search engines..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>OG Image</Label>
            {settings.meta.ogImage ? (
              <div className="space-y-2">
                <img
                  src={settings.meta.ogImage}
                  alt="OG preview"
                  className="h-32 w-auto rounded border border-stone-200 object-cover"
                />
                <button
                  onClick={() => updateMeta("ogImage", "")}
                  className="text-xs text-stone-500 hover:text-stone-700"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint="eventImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    updateMeta("ogImage", res[0].serverData.url);
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
            )}
          </div>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Registration Button */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">
          Registration Button
        </h3>
        <div className="space-y-2">
          <Label>CTA Text</Label>
          <Input
            value={settings.registration.ctaText}
            onChange={(e) => updateRegistration("ctaText", e.target.value)}
            placeholder="Register Now"
          />
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Navbar */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">Navbar</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              value={settings.navbar.style}
              onValueChange={(v) => {
                if (v) updateNavbar("style", v);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sticky">Sticky</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3 sm:col-span-2">
            <Label>Show organization logo</Label>
            <Switch
              checked={settings.navbar.showLogo}
              onCheckedChange={(checked: boolean) =>
                updateNavbar("showLogo", checked)
              }
            />
          </div>
        </div>
      </section>

      <div className="border-t border-stone-200" />

      {/* Footer */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">Footer</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Label>Show organizer name</Label>
            <Switch
              checked={settings.footer.showOrganizer}
              onCheckedChange={(checked: boolean) =>
                updateFooter("showOrganizer", checked)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Custom footer text</Label>
            <Input
              value={settings.footer.customText}
              onChange={(e) => updateFooter("customText", e.target.value)}
              placeholder="Powered by EventKit"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
