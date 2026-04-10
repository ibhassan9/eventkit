export function MockupWebsite() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          </div>
          <div className="mx-auto rounded-md bg-stone-100 px-10 py-1 text-xs text-stone-400">
            techconf-2026.eventkit.ca
          </div>
        </div>

        {/* Website content */}
        <div className="p-5">
          {/* Hero with gradient */}
          <div className="overflow-hidden rounded-lg bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 p-6 text-white sm:p-8">
            <p className="text-[11px] font-medium uppercase tracking-wider text-violet-200 sm:text-xs">
              June 15–16, 2026 · Toronto, ON
            </p>
            <h4 className="mt-2 text-xl font-bold sm:mt-3 sm:text-2xl">
              TechConf 2026
            </h4>
            <p className="mt-1.5 text-sm text-violet-200 sm:mt-2">
              Canada&apos;s premier technology conference
            </p>
            <div className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-700 sm:mt-5">
              Register Now
            </div>
          </div>

          {/* Schedule preview */}
          <div className="mt-4">
            <div className="mb-2.5 text-sm font-semibold text-stone-900">
              Schedule
            </div>
            <div className="space-y-2">
              {[
                {
                  time: "9:00 AM",
                  title: "Opening Keynote",
                  speaker: "Dr. Sarah Liu",
                },
                {
                  time: "10:30 AM",
                  title: "AI Workshop",
                  speaker: "Marcus Chen",
                },
                {
                  time: "1:00 PM",
                  title: "Startup Panel",
                  speaker: "Panel Discussion",
                },
              ].map((item) => (
                <div
                  key={item.time}
                  className="flex items-center gap-3 rounded-lg border border-stone-100 px-3 py-2.5"
                >
                  <span className="whitespace-nowrap text-xs font-medium text-violet-600">
                    {item.time}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-stone-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-stone-400">{item.speaker}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating generate button */}
      <div className="absolute -bottom-3 left-6 flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25">
        <span>Generate</span>
        <span>✨</span>
        <span className="inline-block h-4 w-0.5 bg-white/60 animate-typing-cursor" />
      </div>
    </div>
  );
}
