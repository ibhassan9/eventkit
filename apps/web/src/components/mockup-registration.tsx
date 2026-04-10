export function MockupRegistration() {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
      <div className="border-b border-stone-100 bg-stone-50 px-6 py-4">
        <h4 className="font-semibold text-stone-900">
          Register for TechConf 2026
        </h4>
        <p className="text-sm text-stone-400">General Admission · $149 CAD</p>
      </div>
      <div className="space-y-4 p-6">
        {/* Ticket selector */}
        <div>
          <div className="mb-2 text-sm font-medium text-stone-700">
            Select Ticket
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg border-2 border-violet-500 bg-violet-50 px-3 py-2.5 text-center text-sm font-medium text-violet-700">
              General — $149
            </div>
            <div className="flex-1 rounded-lg border border-stone-200 px-3 py-2.5 text-center text-sm text-stone-500">
              VIP — $349
            </div>
          </div>
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1.5 text-sm font-medium text-stone-700">
              First Name
            </div>
            <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
              Sarah
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium text-stone-700">
              Last Name
            </div>
            <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
              Chen
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="mb-1.5 text-sm font-medium text-stone-700">Email</div>
          <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
            sarah@shopify.com
          </div>
        </div>

        {/* Custom field */}
        <div>
          <div className="mb-1.5 text-sm font-medium text-stone-700">
            Dietary Restrictions
          </div>
          <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-500">
            <span>Vegetarian</span>
            <svg
              className="h-4 w-4 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Credit card section */}
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="mb-2 text-sm font-medium text-stone-700">Payment</div>
          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2">
            <div className="h-5 w-8 rounded bg-blue-600" />
            <span className="text-sm text-stone-400">
              •••• •••• •••• 4242
            </span>
          </div>
        </div>

        {/* Complete button */}
        <div className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-center text-sm font-semibold text-white">
          Complete Registration — $149 CAD
        </div>
      </div>
    </div>
  );
}
