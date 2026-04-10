import { FadeIn } from "./fade-in";

const TESTIMONIALS = [
  {
    quote: "We switched from Cvent and saved 12 hours per event.",
    name: "Sarah K.",
    role: "Events Director, Canadian Nursing Association",
  },
  {
    quote: "The AI website generator alone is worth the subscription.",
    name: "Michael T.",
    role: "Conference Chair, TechTO",
  },
  {
    quote:
      "Finally, an event platform that doesn\u2019t require a PhD to set up.",
    name: "Priya R.",
    role: "Program Coordinator, University of Waterloo",
  },
];

export function Testimonials() {
  return (
    <section className="bg-stone-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 100}>
              <div className="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-8">
                <p className="flex-1 text-stone-700 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-stone-200" />
                  <div>
                    <div className="text-sm font-medium text-stone-900">
                      {t.name}
                    </div>
                    <div className="text-sm text-stone-500">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-stone-400">
          Based on early adopter feedback
        </p>
      </div>
    </section>
  );
}
