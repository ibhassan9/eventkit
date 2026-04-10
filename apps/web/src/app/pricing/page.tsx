import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { PricingCard } from "@/components/pricing-card";
import { PRICING_PLANS } from "@/components/pricing-data";
import { CtaBanner } from "@/components/cta-banner";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "Pricing - EventKit",
  description:
    "Simple, transparent pricing for AI-powered event management. Start free, scale as you grow.",
};

export default function PricingPage() {
  return (
    <div className="pt-16">
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <PricingPageHeader />
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {PRICING_PLANS.map((plan, i) => (
              <AnimateOnScroll key={plan.name} staggerIndex={i + 1}>
                <PricingCard {...plan} />
              </AnimateOnScroll>
            ))}
          </div>
          <PricingComparison />
        </div>
      </section>
      <FaqSection />
      <CtaBanner />
    </div>
  );
}

function PricingPageHeader() {
  return (
    <AnimateOnScroll className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        Simple, transparent pricing
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
        Start free and upgrade when you are ready. No hidden fees, cancel
        anytime. All prices in Canadian dollars.
      </p>
    </AnimateOnScroll>
  );
}

function PricingComparison() {
  return (
    <AnimateOnScroll className="mt-24">
      <h2 className="text-center text-2xl font-bold text-zinc-900">
        Compare plans
      </h2>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="pb-4 pr-4 font-medium text-zinc-500">Feature</th>
              <th className="pb-4 pr-4 font-medium text-zinc-500">Free</th>
              <th className="pb-4 pr-4 font-medium text-zinc-500">Pro</th>
              <th className="pb-4 font-medium text-zinc-500">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature}>
                <td className="py-3 pr-4 font-medium text-zinc-900">
                  {row.feature}
                </td>
                <td className="py-3 pr-4 text-zinc-500">{row.free}</td>
                <td className="py-3 pr-4 text-zinc-500">{row.pro}</td>
                <td className="py-3 text-zinc-500">{row.enterprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimateOnScroll>
  );
}

const COMPARISON_ROWS = [
  { feature: "Events", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Attendees", free: "50", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "AI website generation", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
  { feature: "AI email builder", free: "-", pro: "Included", enterprise: "Included" },
  { feature: "Badge designer", free: "-", pro: "Included", enterprise: "Included" },
  { feature: "Stripe payments", free: "-", pro: "2.9% + 30c", enterprise: "Custom rates" },
  { feature: "Custom forms", free: "-", pro: "Included", enterprise: "Included" },
  { feature: "SSO / SAML", free: "-", pro: "-", enterprise: "Included" },
  { feature: "API access", free: "-", pro: "-", enterprise: "Included" },
  { feature: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated manager" },
];
