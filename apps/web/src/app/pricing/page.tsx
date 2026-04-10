import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Pricing - EventKit",
  description:
    "Simple, transparent pricing for AI-powered event management. Start free, scale as you grow.",
};

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

export default function PricingPage() {
  return (
    <div className="pt-16">
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 text-balance sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-[1.7] text-stone-500">
              Start free and upgrade when you are ready. No hidden fees, cancel
              anytime. All prices in Canadian dollars.
            </p>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Free */}
            <FadeIn>
              <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-stone-900">Free</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-stone-900">$0</span>
                  <span className="ml-1 text-stone-400">/forever</span>
                </div>
                <p className="mt-3 text-sm text-stone-500">
                  Perfect for trying out EventKit
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {[
                    "1 event",
                    "Up to 50 attendees",
                    "Basic event website",
                    "Email confirmations",
                    "QR code check-in",
                    "Community support",
                  ].map((f) => (
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

            {/* Pro */}
            <FadeIn delay={100}>
              <div className="relative flex h-full flex-col rounded-2xl bg-stone-900 p-8 shadow-xl">
                <div className="absolute -top-3 left-8 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold text-white">Pro</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-white">$49</span>
                  <span className="ml-1 text-stone-400">/month</span>
                </div>
                <p className="mt-3 text-sm text-stone-400">
                  Everything for professional events
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {[
                    "Unlimited events",
                    "Unlimited attendees",
                    "AI website generation",
                    "AI email builder",
                    "Custom badge designer",
                    "Stripe payments (CAD)",
                    "Custom registration forms",
                    "Priority email support",
                  ].map((f) => (
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

            {/* Enterprise */}
            <FadeIn delay={200}>
              <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-stone-900">
                  Enterprise
                </h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-stone-900">
                    Custom
                  </span>
                </div>
                <p className="mt-3 text-sm text-stone-500">
                  Advanced security and support
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {[
                    "Everything in Pro",
                    "SSO / SAML authentication",
                    "Dedicated account manager",
                    "Custom integrations",
                    "SLA guarantee",
                    "Invoice billing",
                    "Data export API",
                    "On-premise option",
                  ].map((f) => (
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
                  href="mailto:sales@eventkit.ca"
                  className="mt-8 block rounded-full border border-stone-300 py-3 text-center text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
                >
                  Contact Sales
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Comparison table */}
          <FadeIn className="mt-24">
            <h2 className="text-center text-2xl font-bold text-stone-900">
              Compare plans
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="pb-4 pr-4 font-medium text-stone-500">
                      Feature
                    </th>
                    <th className="pb-4 pr-4 font-medium text-stone-500">
                      Free
                    </th>
                    <th className="pb-4 pr-4 font-medium text-stone-500">
                      Pro
                    </th>
                    <th className="pb-4 font-medium text-stone-500">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature}>
                      <td className="py-3 pr-4 font-medium text-stone-900">
                        {row.feature}
                      </td>
                      <td className="py-3 pr-4 text-stone-500">{row.free}</td>
                      <td className="py-3 pr-4 text-stone-500">{row.pro}</td>
                      <td className="py-3 text-stone-500">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>
      <CtaSection />
    </div>
  );
}

const COMPARISON_ROWS = [
  { feature: "Events", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
  {
    feature: "Attendees",
    free: "50",
    pro: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    feature: "AI website generation",
    free: "Basic",
    pro: "Advanced",
    enterprise: "Advanced",
  },
  {
    feature: "AI email builder",
    free: "-",
    pro: "Included",
    enterprise: "Included",
  },
  {
    feature: "Badge designer",
    free: "-",
    pro: "Included",
    enterprise: "Included",
  },
  {
    feature: "Stripe payments",
    free: "-",
    pro: "2.9% + 30c",
    enterprise: "Custom rates",
  },
  {
    feature: "Custom forms",
    free: "-",
    pro: "Included",
    enterprise: "Included",
  },
  {
    feature: "SSO / SAML",
    free: "-",
    pro: "-",
    enterprise: "Included",
  },
  {
    feature: "API access",
    free: "-",
    pro: "-",
    enterprise: "Included",
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Priority email",
    enterprise: "Dedicated manager",
  },
];
