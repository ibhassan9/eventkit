import { FeatureBlock } from "./feature-block";
import { MockupWebsite } from "./mockup-website";
import { MockupRegistration } from "./mockup-registration";
import { MockupBadge } from "./mockup-badge";
import { MockupCanada } from "./mockup-canada";

export function FeatureSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
      <div className="space-y-24 lg:space-y-32">
        <FeatureBlock
          badge="AI Websites"
          title="AI-powered event websites"
          description="Describe your event in a few sentences and watch as AI generates a complete, beautiful event website. Customizable themes, automatic schedule layouts, and speaker bios — all generated in seconds, not hours."
        >
          <MockupWebsite />
        </FeatureBlock>

        <FeatureBlock
          badge="Registration"
          title="Registration that just works"
          description="Build custom registration forms with drag-and-drop fields, accept payments through Stripe in Canadian dollars, and send instant confirmation emails. Your attendees get a seamless experience from start to finish."
          reversed
        >
          <MockupRegistration />
        </FeatureBlock>

        <FeatureBlock
          badge="Badges"
          title="Beautiful badges, zero hassle"
          description="Design professional name badges with our visual editor, then print them on-site in under 2 seconds. QR codes for instant check-in, customizable layouts, and support for thermal and standard printers."
        >
          <MockupBadge />
        </FeatureBlock>

        <FeatureBlock
          badge="Made in Canada"
          title="Built for Canada"
          description="CAD-native payments, PIPEDA-friendly data handling, and bilingual support baked in from day one. Whether you are running an event in Toronto, Montreal, or Vancouver, EventKit speaks your language."
          reversed
        >
          <MockupCanada />
        </FeatureBlock>
      </div>
    </section>
  );
}
