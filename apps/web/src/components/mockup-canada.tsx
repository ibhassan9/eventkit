export function MockupCanada() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8 shadow-sm">
      <div className="mb-6 text-5xl" aria-hidden="true">
        🇨🇦
      </div>
      <h4 className="mb-4 text-lg font-semibold text-stone-900">
        Canadian-first infrastructure
      </h4>
      <ul className="space-y-3.5">
        {[
          "Data hosted in Canada",
          "No US data transfers",
          "Prices in CAD",
          "PIPEDA compliant",
        ].map((item) => (
          <li key={item} className="flex items-center gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-violet-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-stone-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
