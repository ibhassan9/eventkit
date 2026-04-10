export function MockupBadge() {
  return (
    <div className="flex items-center justify-center rounded-xl bg-zinc-100 p-8">
      <div className="w-64 overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="text-xs font-medium uppercase tracking-wider text-indigo-200">
            TechConf 2026
          </div>
        </div>
        <div className="p-6">
          <div className="text-xl font-bold text-zinc-900">Sarah Chen</div>
          <div className="mt-0.5 text-sm text-zinc-500">Senior Engineer</div>
          <div className="mt-0.5 text-sm text-zinc-400">Shopify</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              VIP
            </span>
            <div className="grid h-12 w-12 grid-cols-5 grid-rows-5 gap-px">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    i % 3 === 0 || i % 7 === 0
                      ? "bg-zinc-900"
                      : "bg-zinc-200"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
