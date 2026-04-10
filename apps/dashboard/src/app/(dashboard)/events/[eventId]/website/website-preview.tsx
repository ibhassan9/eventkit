"use client";

import type { WebsiteConfig, WebsiteSection } from "@eventkit/types";

interface WebsitePreviewProps {
  config: WebsiteConfig;
}

export function WebsitePreview({ config }: WebsitePreviewProps) {
  const enabledSections = config.sections.filter((s) => s.enabled);
  const { primaryColor, secondaryColor, backgroundColor } = config.theme;

  if (enabledSections.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Enable at least one section to see a preview
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-lg border shadow-sm"
      style={{ backgroundColor }}
    >
      <div className="max-h-[600px] overflow-y-auto">
        {enabledSections.map((section) => (
          <PreviewSection
            key={section.type}
            section={section}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewSection({
  section,
  primaryColor,
  secondaryColor,
}: {
  section: WebsiteSection;
  primaryColor: string;
  secondaryColor: string;
}) {
  switch (section.type) {
    case "hero":
      return (
        <div
          className="px-6 py-12 text-center text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <h1 className="text-2xl font-bold">{section.data.title}</h1>
          <p className="mt-2 text-sm opacity-90">{section.data.subtitle}</p>
          <button
            className="mt-4 rounded-lg px-4 py-2 text-xs font-medium text-white"
            style={{ backgroundColor: secondaryColor }}
          >
            {section.data.ctaText}
          </button>
        </div>
      );
    case "about":
      return (
        <div className="px-6 py-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: primaryColor }}>
            About
          </h2>
          <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-600">
            {section.data.content}
          </p>
        </div>
      );
    case "schedule":
      return (
        <div className="px-6 py-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: primaryColor }}>
            Schedule
          </h2>
          <div className="space-y-2">
            {section.data.items.map((item, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <span className="font-medium" style={{ color: secondaryColor }}>
                  {item.time}
                </span>
                <span className="text-zinc-700">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "speakers":
      return (
        <div className="px-6 py-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: primaryColor }}>
            Speakers
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {section.data.speakers.map((speaker, i) => (
              <div key={i} className="text-xs">
                <p className="font-medium text-zinc-900">{speaker.name}</p>
                <p className="text-zinc-500">
                  {speaker.title}
                  {speaker.company ? `, ${speaker.company}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    case "location":
      return (
        <div className="px-6 py-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: primaryColor }}>
            Location
          </h2>
          <p className="text-xs font-medium text-zinc-900">
            {section.data.venue}
          </p>
          <p className="text-xs text-zinc-500">{section.data.address}</p>
        </div>
      );
    case "faq":
      return (
        <div className="px-6 py-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: primaryColor }}>
            FAQ
          </h2>
          <div className="space-y-2">
            {section.data.items.map((item, i) => (
              <div key={i} className="text-xs">
                <p className="font-medium text-zinc-900">{item.question}</p>
                <p className="text-zinc-500">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      );
  }
}
