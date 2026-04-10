import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@eventkit/ui/sonner";
import { TooltipProvider } from "@eventkit/ui/tooltip";
import { ScrollNav } from "@/components/scroll-nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EventKit — AI-Native Event Management",
  description:
    "The modern event platform for Canadian organizations. Registration, payments, beautiful event websites, and on-site check-in — set up in minutes, not days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <TooltipProvider>
          <ScrollNav />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
