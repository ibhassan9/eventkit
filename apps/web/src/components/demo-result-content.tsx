const DEMO_RESULT = {
  title: "Northern Lights Tech Summit 2026",
  subtitle: "Where innovation meets the Canadian frontier",
  date: "September 18-19, 2026",
  location: "Metro Toronto Convention Centre",
  stats: [
    { label: "Speakers", value: "32" },
    { label: "Workshops", value: "16" },
    { label: "Attendees", value: "1,200" },
  ],
  schedule: [
    { time: "9:00 AM", title: "Opening Keynote: The Future of AI in Canada" },
    { time: "10:30 AM", title: "Workshop: Building with LLMs" },
    { time: "1:00 PM", title: "Panel: Startup Ecosystem in 2026" },
  ],
};

export function DemoResultContent({
  visibleLines,
  isGenerating,
}: {
  visibleLines: number;
  isGenerating: boolean;
}) {
  return (
    <>
      <div
        className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white transition-opacity duration-500"
        style={{ opacity: visibleLines >= 1 ? 1 : 0 }}
      >
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          {DEMO_RESULT.date} | {DEMO_RESULT.location}
        </p>
        <h3 className="mt-2 text-xl font-bold">{DEMO_RESULT.title}</h3>
        <p className="mt-1 text-sm opacity-80">{DEMO_RESULT.subtitle}</p>
      </div>
      <div className="p-6">
        <div
          className="grid grid-cols-3 gap-3 transition-opacity duration-500"
          style={{ opacity: visibleLines >= 2 ? 1 : 0 }}
        >
          {DEMO_RESULT.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-zinc-50 p-3 text-center"
            >
              <div className="text-xl font-bold text-zinc-900">
                {stat.value}
              </div>
              <div className="text-xs text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {DEMO_RESULT.schedule.map((item, i) => (
            <div
              key={item.time}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 px-4 py-3 transition-opacity duration-500"
              style={{ opacity: visibleLines >= 3 + i ? 1 : 0 }}
            >
              <span className="text-sm font-medium text-indigo-600">
                {item.time}
              </span>
              <span className="text-sm text-zinc-700">{item.title}</span>
            </div>
          ))}
        </div>
        <div
          className="mt-6 transition-opacity duration-500"
          style={{ opacity: visibleLines >= 6 ? 1 : 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
            Register Now
          </div>
        </div>
        {isGenerating && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-indigo-500 animate-typing-cursor" />
            <span className="text-xs text-zinc-400">Generating...</span>
          </div>
        )}
      </div>
    </>
  );
}
