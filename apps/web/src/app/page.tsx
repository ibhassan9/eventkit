import { HeroSection } from "@/components/hero-section";
import { SocialProofBar } from "@/components/social-proof-bar";
import { FeatureSection } from "@/components/feature-section";
import { HowItWorks } from "@/components/how-it-works";
import { PricingSection } from "@/components/pricing-section";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <FeatureSection />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <CtaSection />
    </>
  );
}
