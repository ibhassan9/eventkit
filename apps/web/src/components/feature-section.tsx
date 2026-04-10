import { FadeIn } from "./fade-in";
import { MockupWebsite } from "./mockup-website";
import { MockupRegistration } from "./mockup-registration";
import { MockupCheckin } from "./mockup-checkin";
import { MockupCanada } from "./mockup-canada";

interface Feature {
  badge: string;
  title: string;
  description: string;
  reversed: boolean;
  mockup: React.ComponentType;
}

const FEATURES: Feature[] = [
  {
    badge: "AI-POWERED",
    title: "AI generates your event website in seconds",
    description:
      "Describe your event in a sentence. Our AI creates a beautiful, responsive event website — complete with schedule, speaker profiles, and registration. Edit anything, publish instantly.",
    reversed: false,
    mockup: MockupWebsite,
  },
  {
    badge: "REGISTRATION",
    title: "Registration that handles everything",
    description:
      "Custom forms with drag-and-drop fields. Stripe payments with zero platform fee on top. Instant confirmation emails with QR codes. Walk-in registration at the door. It just works.",
    reversed: true,
    mockup: MockupRegistration,
  },
  {
    badge: "CHECK-IN",
    title: "Check in 500 people without breaking a sweat",
    description:
      "Scan a QR code or search by name. Badge prints in 2 seconds. Works offline on any tablet. Real-time dashboard shows exactly who\u2019s arrived.",
    reversed: false,
    mockup: MockupCheckin,
  },
  {
    badge: "CANADIAN",
    title: "Built for Canada, from day one",
    description:
      "Canadian data residency. PIPEDA-friendly. CAD-native pricing. Bilingual-ready. Built in Toronto by a team that understands Canadian organizations.",
    reversed: true,
    mockup: MockupCanada,
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="space-y-24 lg:space-y-32">
          {FEATURES.map((feature) => {
            const Mockup = feature.mockup;
            return (
              <div
                key={feature.title}
                className={`flex flex-col items-center gap-12 lg:flex-row lg:gap-20 ${
                  feature.reversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                <FadeIn className="flex-1">
                  <div className="max-w-lg">
                    <span className="inline-block rounded-full bg-violet-500/10 px-3 py-1 text-[13px] font-medium uppercase tracking-wide text-violet-600">
                      {feature.badge}
                    </span>
                    <h3 className="mt-4 text-[28px] font-semibold leading-[1.2] tracking-tight text-stone-900 text-balance sm:text-[40px]">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-lg leading-[1.7] text-stone-500">
                      {feature.description}
                    </p>
                  </div>
                </FadeIn>
                <FadeIn className="flex-1" delay={150}>
                  <Mockup />
                </FadeIn>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
