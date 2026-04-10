import type { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "EventKit - AI-Native Event Management",
  description:
    "Set up your event in 10 minutes. AI-powered websites, registration, badges, and check-in. Built for Canada.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
