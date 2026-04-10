export function MockupCheckin() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
      {/* Tablet-style header */}
      <div className="bg-stone-900 px-5 py-3.5 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-violet-500" />
            <span className="text-sm font-bold text-white">
              EventKit Check-in
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-stone-400">Online</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Search bar */}
        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
          <svg
            className="h-5 w-5 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-base text-stone-400">
            Search attendees or scan QR…
          </span>
        </div>

        {/* Attendee card */}
        <div className="mt-4 rounded-xl border border-stone-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-bold text-stone-900">Sarah Chen</div>
              <div className="mt-0.5 text-sm text-stone-500">
                VP Engineering, Shopify
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  VIP
                </span>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                  Table 12
                </span>
              </div>
            </div>
            {/* QR code */}
            <div className="grid h-14 w-14 grid-cols-5 grid-rows-5 gap-px overflow-hidden rounded-lg">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    i % 3 === 0 || i % 7 === 0
                      ? "bg-stone-800"
                      : "bg-stone-200"
                  }
                />
              ))}
            </div>
          </div>

          {/* Check-in button with green glow */}
          <div className="mt-5 rounded-xl bg-green-500 py-4 text-center text-lg font-bold text-white animate-pulse-glow">
            Check In
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-stone-50 p-3 text-center">
            <div className="text-lg font-bold text-stone-900">487</div>
            <div className="text-xs text-stone-400">Checked In</div>
          </div>
          <div className="rounded-lg bg-stone-50 p-3 text-center">
            <div className="text-lg font-bold text-stone-900">513</div>
            <div className="text-xs text-stone-400">Remaining</div>
          </div>
          <div className="rounded-lg bg-stone-50 p-3 text-center">
            <div className="text-lg font-bold text-green-600">48.7%</div>
            <div className="text-xs text-stone-400">Arrived</div>
          </div>
        </div>
      </div>
    </div>
  );
}
