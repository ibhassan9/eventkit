import Link from "next/link";
import { FadeIn } from "./fade-in";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
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
  );
}

const FREE_FEATURES = [
  "1 event",
  "Up to 50 attendees",
  "Event website",
  "Registration + payments",
  "QR code check-in",
  "Email confirmations",
];

const PRO_FEATURES = [
  "Unlimited events",
  "Unlimited attendees",
  "AI website generator",
  "AI email writer",
  "AI badge designer",
  "Custom registration forms",
  "Email builder + campaigns",
  "Badge printing",
  "Real-time check-in dashboard",
  "CSV export",
  "Priority support",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <h2 className="text-[28px] font-semibold tracking-tight text-stone-900 text-balance sm:text-[40px]">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-[1.7] text-stone-500">
            No per-attendee fees. No surprise charges. No platform transaction
            fee.
          </p>
        </FadeIn>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Card */}
          <FadeIn>
            <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <div>
                <h3 className="text-xl font-semibold text-stone-900">Free</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-stone-900">$0</span>
                  <span className="ml-1 text-stone-400">/forever</span>
                </div>
                <p className="mt-3 text-stone-500">
                  Perfect for getting started
                </p>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-stone-600"
                  >
                    <CheckIcon className="text-stone-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-full border border-stone-300 py-3 text-center text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
              >
                Get Started
              </Link>
            </div>
          </FadeIn>

          {/* Pro Card */}
          <FadeIn delay={100}>
            <div className="relative flex h-full flex-col rounded-2xl bg-stone-900 p-8 shadow-xl">
              <div className="absolute -top-3 left-8 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Pro</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-white">$49</span>
                  <span className="ml-1 text-stone-400">/month</span>
                </div>
                <p className="mt-3 text-stone-400">
                  Everything you need to run professional events
                </p>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-stone-300"
                  >
                    <CheckIcon className="text-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
              >
                Start Free Trial
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Enterprise aside */}
        <FadeIn>
          <p className="mt-12 text-center text-sm text-stone-500">
            Need custom integrations, SLA, or on-premise hosting?{" "}
            <Link
              href="mailto:sales@eventkit.ca"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Contact us →
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
