import { AnimateOnScroll } from "./animate-on-scroll";
import { PricingCard } from "./pricing-card";
import { PRICING_PLANS } from "./pricing-data";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimateOnScroll className="text-center">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
            Start free and scale as you grow. No hidden fees, no surprises.
            All prices in Canadian dollars.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <AnimateOnScroll key={plan.name} staggerIndex={i + 1}>
              <PricingCard {...plan} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
