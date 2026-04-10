export function MockupCanada() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-4">
        <h4 className="font-semibold text-zinc-900">Event Settings</h4>
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-zinc-900">Currency</div>
            <div className="text-xs text-zinc-400">Transaction currency</div>
          </div>
          <div className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-zinc-700">
            CAD $
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-zinc-900">Data Residency</div>
            <div className="text-xs text-zinc-400">PIPEDA-compliant storage</div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Canada
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-zinc-900">Language</div>
            <div className="text-xs text-zinc-400">Bilingual support</div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
              EN
            </span>
            <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-500">
              FR
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="text-sm font-medium text-emerald-800">
            Stripe Connect (Canada)
          </div>
          <div className="text-sm text-emerald-600">Connected</div>
        </div>
      </div>
    </div>
  );
}
