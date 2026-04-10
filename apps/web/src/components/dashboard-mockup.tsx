export function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-stone-300" />
          <div className="h-3 w-3 rounded-full bg-stone-300" />
          <div className="h-3 w-3 rounded-full bg-stone-300" />
        </div>
        <div className="mx-auto rounded-md bg-stone-100 px-16 py-1 text-xs text-stone-400">
          app.eventkit.ca/dashboard
        </div>
      </div>

      {/* App content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-48 shrink-0 border-r border-stone-100 bg-stone-50/80 p-4 lg:block">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-violet-600" />
            <span className="text-sm font-bold text-stone-900">EventKit</span>
          </div>
          <nav className="space-y-1">
            {["Dashboard", "Events", "Attendees", "Emails", "Analytics"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    i === 0
                      ? "bg-violet-50 font-medium text-violet-700"
                      : "text-stone-500"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 sm:p-6">
          {/* Header row */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
                TechConf 2026
              </h3>
              <p className="text-xs text-stone-400 sm:text-sm">
                June 15–16, Toronto
              </p>
            </div>
            <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {[
              { label: "Registrations", value: "1,247", change: "+23%" },
              { label: "Revenue", value: "$86,490", change: "+18%" },
              { label: "Checked In", value: "892", change: "71.5%" },
              { label: "Page Views", value: "14.2k", change: "+340%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-stone-100 p-3 sm:p-4"
              >
                <div className="text-[11px] text-stone-400 sm:text-xs">
                  {stat.label}
                </div>
                <div className="mt-1 text-base font-bold text-stone-900 sm:text-xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-green-600 sm:text-xs">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Table preview */}
          <div className="mt-5 overflow-hidden rounded-xl border border-stone-100 sm:mt-6">
            <div className="border-b border-stone-100 px-4 py-3">
              <span className="text-sm font-medium text-stone-900">
                Recent Registrations
              </span>
            </div>
            <div className="divide-y divide-stone-50">
              {[
                {
                  name: "Sarah Chen",
                  email: "sarah@shopify.com",
                  ticket: "VIP",
                  time: "2m ago",
                },
                {
                  name: "Marcus Williams",
                  email: "marcus@rbc.com",
                  ticket: "General",
                  time: "5m ago",
                },
                {
                  name: "Priya Patel",
                  email: "priya@uwaterloo.ca",
                  ticket: "Student",
                  time: "12m ago",
                },
              ].map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-[10px] font-medium text-stone-500 sm:h-8 sm:w-8 sm:text-xs">
                      {row.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-stone-900 sm:text-sm">
                        {row.name}
                      </div>
                      <div className="hidden text-xs text-stone-400 sm:block">
                        {row.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 sm:inline">
                      {row.ticket}
                    </span>
                    <span className="text-[11px] text-stone-400 sm:text-xs">
                      {row.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
