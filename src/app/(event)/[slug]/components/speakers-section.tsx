import type { SpeakersData, WebsiteConfig } from "@/types";

interface SpeakersSectionProps {
  data: SpeakersData;
  theme: WebsiteConfig["theme"];
}

export function SpeakersSection({ data, theme }: SpeakersSectionProps) {
  if (data.speakers.length === 0) return null;

  return (
    <section id="speakers" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2
            className="mb-2 text-sm font-semibold tracking-widest uppercase"
            style={{ color: theme.secondaryColor }}
          >
            Speakers
          </h2>
          <h3
            className="text-3xl font-bold tracking-tight"
            style={{ color: theme.primaryColor }}
          >
            Meet the Experts
          </h3>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.speakers.map((speaker, index) => (
            <div
              key={index}
              className="group rounded-2xl border p-6 text-center transition-shadow duration-300 hover:shadow-lg"
              style={{ borderColor: `${theme.primaryColor}10` }}
            >
              <div
                className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                {speaker.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <h4
                className="text-lg font-semibold"
                style={{ color: theme.primaryColor }}
              >
                {speaker.name}
              </h4>
              <p className="mt-1 text-sm" style={{ color: theme.secondaryColor }}>
                {speaker.title}
              </p>
              {speaker.company && (
                <p
                  className="text-sm"
                  style={{ color: `${theme.primaryColor}70` }}
                >
                  {speaker.company}
                </p>
              )}
              {speaker.bio && (
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: `${theme.primaryColor}80` }}
                >
                  {speaker.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
