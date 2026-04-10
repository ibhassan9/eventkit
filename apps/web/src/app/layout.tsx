import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@eventkit/ui/sonner";
import { TooltipProvider } from "@eventkit/ui/tooltip";
import { MarketingHeader } from "@/components/marketing-header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EventKit - AI-Native Event Management",
  description:
    "Set up your event in 10 minutes. AI-powered event websites, registration, badges, and check-in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <MarketingHeader />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
