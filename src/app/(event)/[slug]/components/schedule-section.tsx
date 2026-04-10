import type { ScheduleData, WebsiteConfig } from "@/types";

interface ScheduleSectionProps {
  data: ScheduleData;
  theme: WebsiteConfig["theme"];
}

export function ScheduleSection({ data, theme }: ScheduleSectionProps) {
  if (data.items.length === 0) return null;

  return (
    <section id="schedule" className="px-6 py-24" style={{ backgroundColor: `${theme.primaryColor}05` }}>
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-2 text-sm font-semibold tracking-widest uppercase"
          style={{ color: theme.secondaryColor }}
        >
          Schedule
        </h2>
        <h3
          className="mb-12 text-3xl font-bold tracking-tight"
          style={{ color: theme.primaryColor }}
        >
          Event Timeline
        </h3>
        <div className="relative space-y-0">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{ backgroundColor: `${theme.secondaryColor}30` }}
          />
          {data.items.map((item, index) => (
            <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
              <div className="relative flex-shrink-0">
                <div
                  className="mt-1.5 size-[15px] rounded-full border-[3px]"
                  style={{
                    borderColor: theme.secondaryColor,
                    backgroundColor: theme.backgroundColor,
                  }}
                />
              </div>
              <div className="flex-1 pb-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.secondaryColor }}
                >
                  {item.time}
                </p>
                <h4
                  className="mt-1 text-lg font-semibold"
                  style={{ color: theme.primaryColor }}
                >
                  {item.title}
                </h4>
                {item.description && (
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: `${theme.primaryColor}99` }}
                  >
                    {item.description}
                  </p>
                )}
                {item.speaker && (
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: `${theme.primaryColor}80` }}
                  >
                    {item.speaker}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
