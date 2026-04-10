import { HeroSection } from "@/components/marketing/hero-section";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { FeatureSection } from "@/components/marketing/feature-section";
import { AiDemoSection } from "@/components/marketing/ai-demo-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaBanner } from "@/components/marketing/cta-banner";

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
