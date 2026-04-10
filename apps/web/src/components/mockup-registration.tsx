export function MockupRegistration() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-4">
        <h4 className="font-semibold text-zinc-900">Registration</h4>
        <p className="text-sm text-zinc-400">TechConf 2026 - General Admission</p>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <div className="mb-1.5 text-sm font-medium text-zinc-700">Full Name</div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400">
            Sarah Chen
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium text-zinc-700">Email</div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400">
            sarah@company.com
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium text-zinc-700">Ticket Type</div>
          <div className="flex gap-2">
            <div className="rounded-lg border-2 border-indigo-500 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
              General — $149
            </div>
            <div className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
              VIP — $349
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
          <span className="text-sm font-medium text-green-700">Payment confirmed</span>
          <span className="text-sm text-green-600">$149.00 CAD</span>
        </div>
      </div>
    </div>
  );
}
