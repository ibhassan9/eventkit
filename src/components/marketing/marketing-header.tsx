import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
] as const;

export function MarketingHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          EventKit
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-sm font-medium text-zinc-500"
              render={<Link href="/sign-in" />}
            >
              Sign In
            </Button>
            <Button
              className="rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
              render={<Link href="/sign-up" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
