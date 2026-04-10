import { HeroSection } from "@/components/hero-section";
import { SocialProofBar } from "@/components/social-proof-bar";
import { FeatureSection } from "@/components/feature-section";
import { AiDemoSection } from "@/components/ai-demo-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { CtaBanner } from "@/components/cta-banner";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <div id="features">
        <FeatureSection />
      </div>
      <AiDemoSection />
      <PricingSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
