import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@eventkit/ui/sonner";
import { TooltipProvider } from "@eventkit/ui/tooltip";
import "./globals.css";

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
      <html lang="en">
        <body className="antialiased">
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
