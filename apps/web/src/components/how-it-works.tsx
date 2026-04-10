import { Fragment } from "react";
import { FadeIn } from "./fade-in";

const STEPS = [
  {
    number: "01",
    title: "Create",
    description: "Describe your event and let AI do the heavy lifting",
  },
  {
    number: "02",
    title: "Customize",
    description:
      "Tweak your website, registration form, and badges to perfection",
  },
  {
    number: "03",
    title: "Launch",
    description: "Publish your event page and start accepting registrations",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-stone-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <h2 className="text-center text-[28px] font-semibold tracking-tight text-stone-100 text-balance sm:text-[40px]">
            Go live in 10 minutes
          </h2>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-stretch">
          {STEPS.map((step, i) => (
            <Fragment key={step.number}>
              <FadeIn delay={i * 100} className="flex-1">
                <div className="flex h-full flex-col rounded-2xl border border-stone-700 bg-stone-800 p-8">
                  <div className="mb-4 text-sm font-bold text-violet-400">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-stone-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-stone-400">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
              {i < STEPS.length - 1 && (
                <div className="hidden items-center justify-center md:flex">
                  <div className="w-8 border-t border-dashed border-stone-600" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
