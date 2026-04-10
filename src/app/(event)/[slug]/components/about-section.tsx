import type { AboutData, WebsiteConfig } from "@/types";

interface AboutSectionProps {
  data: AboutData;
  theme: WebsiteConfig["theme"];
}

export function AboutSection({ data, theme }: AboutSectionProps) {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-2 text-sm font-semibold tracking-widest uppercase"
          style={{ color: theme.secondaryColor }}
        >
          About the Event
        </h2>
        <div className="mt-6 space-y-4">
          {data.content.split("\n").filter(Boolean).map((paragraph, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed"
              style={{ color: `${theme.primaryColor}cc` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
