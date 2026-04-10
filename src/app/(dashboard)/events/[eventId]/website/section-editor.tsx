"use client";

import type { WebsiteSection } from "@/types";
import { HeroEditor } from "./editors/hero-editor";
import { AboutEditor } from "./editors/about-editor";
import { ScheduleEditor } from "./editors/schedule-editor";
import { SpeakersEditor } from "./editors/speakers-editor";
import { LocationEditor } from "./editors/location-editor";
import { FaqEditor } from "./editors/faq-editor";

interface SectionEditorProps {
  section: WebsiteSection;
  onChange: (section: WebsiteSection) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  switch (section.type) {
    case "hero":
      return (
        <HeroEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "about":
      return (
        <AboutEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "schedule":
      return (
        <ScheduleEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "speakers":
      return (
        <SpeakersEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "location":
      return (
        <LocationEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
    case "faq":
      return (
        <FaqEditor
          data={section.data}
          onChange={(data) => onChange({ ...section, data })}
        />
      );
  }
}
