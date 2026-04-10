import type { Metadata } from "next";
import { Toaster } from "@eventkit/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventKit",
  description: "Event pages powered by EventKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
