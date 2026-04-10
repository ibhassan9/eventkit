"use client";

import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import type { HeroData } from "@eventkit/types";

interface HeroEditorProps {
  data: HeroData;
  onChange: (data: HeroData) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hero-title">Title</Label>
        <Input
          id="hero-title"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Your event title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hero-subtitle">Subtitle</Label>
        <Input
          id="hero-subtitle"
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="A short description or tagline"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hero-cta">CTA Button Text</Label>
        <Input
          id="hero-cta"
          value={data.ctaText}
          onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
          placeholder="Register Now"
        />
      </div>
    </div>
  );
}
