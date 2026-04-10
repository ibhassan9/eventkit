import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@eventkit/ui/sonner";
import { TooltipProvider } from "@eventkit/ui/tooltip";
import "./globals.css";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "EventKit - Dashboard",
  description: "Manage your events with EventKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={font.variable}>
        <body className="antialiased">
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" toastOptions={{ className: "!border !border-stone-200 !bg-white !shadow-lg !rounded-xl" }} />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
