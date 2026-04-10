export function MockupWebsite() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <div className="mx-auto rounded-md bg-zinc-100 px-12 py-1 text-xs text-zinc-400">
          techconf-2026.eventkit.ca
        </div>
      </div>
      <div className="p-6">
        <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
          <p className="text-xs font-medium uppercase tracking-wider opacity-80">
            June 15-16, 2026 | Toronto
          </p>
          <h4 className="mt-2 text-2xl font-bold">TechConf 2026</h4>
          <p className="mt-2 text-sm opacity-80">
            The premier Canadian technology conference
          </p>
          <div className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-600">
            Register Now
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="text-2xl font-bold text-zinc-900">500+</div>
            <div className="text-xs text-zinc-400">Attendees</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="text-2xl font-bold text-zinc-900">24</div>
            <div className="text-xs text-zinc-400">Speakers</div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="text-2xl font-bold text-zinc-900">2</div>
            <div className="text-xs text-zinc-400">Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
